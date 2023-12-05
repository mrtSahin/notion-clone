import { v } from "convex/values";

import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"


export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')// butun islemleri yapmadan once her seferinde kullanicinin giris yapip yapmadigini kontrol ediyoruz
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error("Not found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    // bi documenti silerken onun childlarini da(yani icerisindeki documentler) silmemiz lazim
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq("userId", userId)
            .eq("parentDocument", documentId)
        ))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, { // patch: mevcut belgenin uzerine yazmak icin kullanilir
          isArchived: true
        })

        await recursiveArchive(child._id)

      }
    }

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    })

    recursiveArchive(args.id)

    return document
  }
})

export const getSideBar = query({
  args: {
    parentDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')// butun islemleri yapmadan once her seferinde kullanicinin giris yapip yapmadigini kontrol ediyoruz
    }

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument)
      )
      .filter((q) =>
        q.eq(q.field('isArchived'), false)
      )
      .order('desc')
      .collect()// collect ile verileri bir dizi icerisinde sunuyor
    return documents
  }
})

export const create = mutation({ // convex db de veri alani acacak olan metod
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
    }

    const userId = identity.subject

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })
    return document

  }
})

export const getTrash = query({

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
    }

    const userId = identity.subject

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect()

    return documents
  }
})

export const restore = mutation({ //silinen dosyayi geri getirme
  args: { id: v.id("documents") },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error("Not found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query("documents")
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq("parentDocument", documentId)
        ))
        .collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false
    }

    if (existingDocument.parentDocument) { // 
      const parent = await ctx.db.get(existingDocument.parentDocument)
      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    const document = await ctx.db.patch(args.id, options)

    recursiveRestore(args.id)

    return document
  }
})

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error("Not found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.delete(args.id)

    return document
  }
})


export const getSearch = query({
  handler: async (ctx) => {
    
      const identity = await ctx.auth.getUserIdentity()

      if (!identity) {
        throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
      }

      const userId = identity.subject

      const documents= await ctx.db
      .query("documents")
      .withIndex("by_user",(q)=>q.eq("userId",userId))
      .filter((q)=>q.eq(q.field("isArchived"),false))
      .order("desc")
      .collect()

      return documents
    }
  })