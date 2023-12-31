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

export const getSideBar = query({  // --------------------------------------------------------------------------------------
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
      .query('documents') //query işlevi, sorgulanacak koleksiyonun adını belirtmek için kullanılır.
      .withIndex('by_user_parent', (q) => //withIndex işlevi, sorgu için kullanılacak dizini belirtmek için kullanılır.
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument)
      )
      .filter((q) => //filter işlevi, sonuçları isArchived alanına göre filtrelemek için kullanılır.
        q.eq(q.field('isArchived'), false)
      )
      .order('desc')//order işlevi, sonuçları azalan sırada sıralamak için kullanılır.
      .collect()// collect ile verileri bir dizi icerisinde sunuyor
  
    return documents
  }
})

export const create = mutation({ // convex db de veri alani acacak olan metod ----------------------------------------------------------------
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

    const document = await ctx.db.insert('documents', { // convex db de satır yani yeni bir belge oluşturma metodu
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    })

    
    return document

  }
})

export const getTrash = query({ // cop kutusundaki belgeleri getirir

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

export const remove = mutation({ // kalici olarak silme -------------------------------------------------------------------
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated") // kullanici giris yapmadiginda bu hatayi atacak
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)  // belgenin varlığını sorgulamak için alıyor

    if (!existingDocument) {
      throw new Error("Not found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.delete(args.id) // belgeyi convex db den tamamen siliyor

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

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect()

    return documents
  }
})

export const getById = query({ // components icerisindeki navbar da kullaniliyor
  args: { documentId: v.id('documents') }, // metodu cagirdigimizda args yi useQury icerisinde bu metodun ismini yazdiktan sonra bir obje turunde yolluyoruz
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity()

    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Not found')
    }

    if (document.isPublished && !document.isArchived) {
      return document
    }

    if (!identity) {
      throw new Error('Not authenticated') // kimlik dogrulanmadi
    }

    const userId = identity.subject

    if (document.userId !== userId) {
      throw new Error("Unauthorized") // yetkisiz
    }

    return document

  }
})

export const update = mutation({ // _components de Title de kullaniyoruz. belgelerde guncelleme icin kullanilacak
  args: {
    id: v.id("documents"), // convex de documents isimli tablodaki id ler
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthenticated")
    }

    const userId = identity.subject

    //rest yapiyoruz
    const { id, ...rest } = args // belgenin varlığını ve kullanıcı iznini kontrol edebilmek için id yi alıyoruz

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error("Not found")
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    }) // spread 

    return document
  }
})

export const removeIcon = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthenticated') // kimlik dogrulanmadi
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId != userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    })

    return document
  }
})

export const removeCover = mutation({
  args:{id:v.id("documents")},
  handler:async (ctx,args)=>{
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Unauthenticated') // kimlik dogrulanmadi
    }

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)

    if (!existingDocument) {
      throw new Error('Not found')
    }

    if (existingDocument.userId != userId) {
      throw new Error("Unauthorized")
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined
    })

    return document
  }
})