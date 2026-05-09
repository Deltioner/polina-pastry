"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Search, ImageOff, Upload, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import {
  createProduct as createProductDb,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
  uploadProductImage,
  fetchProducts,
} from "@/lib/products";
import type { Product, ProductCategory, Locale } from "@/types";
import { formatWeight } from "@/lib/format";
import clsx from "clsx";

const CATEGORIES: ProductCategory[] = ["cakes", "pastries", "cookies", "bread", "seasonal", "custom"];
const LOCALES: Locale[] = ["en", "uk", "nl", "ar"];
const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  nl: "Nederlands",
  ar: "العربية",
};

type FormData = {
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  ingredients: Record<Locale, string>;
  price: string;
  category: ProductCategory;
  image: string;
  /** newline-separated extra image URLs */
  gallery: string;
  featured: boolean;
  available: boolean;
  weight: string;
  allergens: string;
};

const blankForm = (): FormData => ({
  name: { en: "", uk: "", nl: "", ar: "" },
  description: { en: "", uk: "", nl: "", ar: "" },
  ingredients: { en: "", uk: "", nl: "", ar: "" },
  price: "",
  category: "cakes",
  image: "",
  gallery: "",
  featured: false,
  available: true,
  weight: "",
  allergens: "",
});

const inputCls =
  "w-full border border-blush-200 rounded-xl px-4 py-3 font-body text-burgundy-800 bg-white text-base placeholder:text-burgundy-700/35";

export default function AdminProductsPage() {
  const { products, setProducts } = useStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(blankForm());
  const [activeLoc, setActiveLoc] = useState<Locale>("en");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const fresh = await fetchProducts();
    setProducts(fresh);
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    const result = await uploadProductImage(file);
    setUploadingMain(false);
    if (result) {
      setForm((f) => ({ ...f, image: result.url }));
      setImgError(false);
    } else {
      setSaveError("Image upload failed. Check your Supabase storage policies.");
    }
    e.target.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const result = await uploadProductImage(file);
      if (result) uploaded.push(result.url);
    }
    setUploadingGallery(false);
    if (uploaded.length > 0) {
      setForm((f) => ({
        ...f,
        gallery: [f.gallery.trim(), ...uploaded].filter(Boolean).join("\n"),
      }));
    }
    e.target.value = "";
  };

  const filtered = products.filter(
    (p) =>
      p.name.en.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(blankForm());
    setEditId(null);
    setShowForm(true);
    setActiveLoc("en");
    setImgError(false);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: { ...p.name },
      description: { ...p.description },
      ingredients: {
        en: p.ingredients?.en ?? "",
        uk: p.ingredients?.uk ?? "",
        nl: p.ingredients?.nl ?? "",
        ar: p.ingredients?.ar ?? "",
      },
      price: p.price.toString(),
      category: p.category,
      image: p.image,
      gallery: p.images?.join("\n") ?? "",
      featured: p.featured,
      available: p.available,
      weight: p.weight ?? "",
      allergens: p.allergens?.join(", ") ?? "",
    });
    setEditId(p.id);
    setShowForm(true);
    setActiveLoc("en");
    setImgError(false);
  };

  const handleSave = async () => {
    if (!form.name.en || !form.price) return;
    setSaving(true);
    setSaveError(null);

    const galleryUrls = form.gallery
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    const hasIngredients = Object.values(form.ingredients).some((v) => v.trim());
    const data = {
      name: form.name,
      description: form.description,
      ingredients: hasIngredients ? form.ingredients : undefined,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image || "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
      images: galleryUrls.length > 0 ? galleryUrls : undefined,
      featured: form.featured,
      available: form.available,
      weight: form.weight || undefined,
      allergens: form.allergens
        ? form.allergens.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
    };

    const saved = editId
      ? await updateProductDb(editId, data)
      : await createProductDb(data);

    setSaving(false);

    if (!saved) {
      setSaveError("Could not save. Are you signed in as admin?");
      return;
    }
    await refresh();
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProductDb(id);
    setConfirmDelete(null);
    if (ok) await refresh();
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      type="button"
      className={clsx(
        "w-11 h-6 rounded-full relative transition-colors shrink-0",
        checked ? "bg-burgundy-500" : "bg-blush-200"
      )}
    >
      <div
        className={clsx(
          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="script text-2xl text-caramel-500 mb-1">manage</p>
          <h1 className="font-display text-4xl text-burgundy-500 font-medium">Products</h1>
          <p className="font-body text-sm text-burgundy-700/55 mt-1">
            {products.length} items in catalogue
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-5 py-3">
          <Plus size={14} /> Add new
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-burgundy-700/40" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputCls} pl-10`}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-blush-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-blush-50 border-b border-blush-100">
              {["Product", "Category", "Price", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3.5 font-body text-xs tracking-widest uppercase text-burgundy-700/55"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blush-100">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-blush-50/40 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blush-50 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name.en}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-body text-burgundy-800 text-sm">{product.name.en}</p>
                      {product.weight && (
                        <p className="font-body text-xs text-burgundy-700/45">
                          {formatWeight(product.weight)}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-body text-xs tracking-widest uppercase px-2.5 py-1 bg-blush-100 text-burgundy-700 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-display text-lg text-burgundy-500 font-medium">
                    €{product.price.toFixed(2)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-col gap-1">
                    <span
                      className={clsx(
                        "font-body text-xs tracking-widest uppercase px-2 py-0.5 rounded-full inline-block w-fit",
                        product.available
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-500"
                      )}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                    {product.featured && (
                      <span className="font-body text-xs tracking-widest uppercase px-2 py-0.5 bg-gold-100 text-gold-800 rounded-full inline-block w-fit">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 rounded-full bg-blush-50 text-burgundy-500 hover:bg-blush-100 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="script text-3xl text-caramel-500 mb-1">nothing here</p>
            <p className="font-body text-burgundy-700/55">No products found.</p>
          </div>
        )}
      </div>

      {/* ── FORM MODAL ────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-burgundy-800/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream-50 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 bg-burgundy-500 px-6 py-5 flex items-center justify-between z-10 rounded-t-3xl">
              <h2 className="font-display text-2xl text-cream-50 font-medium">
                {editId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-cream-50/80 hover:text-cream-50 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-7 space-y-7">
              {/* Locale switcher */}
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-3">
                  Language / Translations
                </p>
                <div className="flex gap-1.5 flex-wrap mb-5">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setActiveLoc(loc)}
                      type="button"
                      className={clsx(
                        "px-4 py-2 font-body text-xs tracking-wider rounded-full transition-all",
                        activeLoc === loc
                          ? "bg-burgundy-500 text-cream-50"
                          : "bg-blush-100 text-burgundy-700 hover:bg-blush-200"
                      )}
                    >
                      {LOCALE_LABELS[loc]}
                    </button>
                  ))}
                </div>

                <div dir={activeLoc === "ar" ? "rtl" : "ltr"} className="space-y-4">
                  <div>
                    <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                      Name ({activeLoc.toUpperCase()}) *
                    </label>
                    <input
                      value={form.name[activeLoc]}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          name: { ...f.name, [activeLoc]: e.target.value },
                        }))
                      }
                      placeholder={`Product name in ${LOCALE_LABELS[activeLoc]}`}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                      Description ({activeLoc.toUpperCase()})
                    </label>
                    <textarea
                      value={form.description[activeLoc]}
                      rows={3}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          description: { ...f.description, [activeLoc]: e.target.value },
                        }))
                      }
                      placeholder={`Description in ${LOCALE_LABELS[activeLoc]}`}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                      Ingredients ({activeLoc.toUpperCase()})
                    </label>
                    <textarea
                      value={form.ingredients[activeLoc]}
                      rows={3}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          ingredients: { ...f.ingredients, [activeLoc]: e.target.value },
                        }))
                      }
                      placeholder={`Ingredients in ${LOCALE_LABELS[activeLoc]}`}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
                    }
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main image — file upload OR URL */}
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                  Main image
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => mainFileRef.current?.click()}
                    disabled={uploadingMain}
                    className="btn-blush inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                  >
                    {uploadingMain ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={14} /> Upload from device
                      </>
                    )}
                  </button>
                  <input
                    ref={mainFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainUpload}
                    className="hidden"
                  />
                </div>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, image: e.target.value }));
                    setImgError(false);
                  }}
                  placeholder="…or paste an image URL"
                  className={inputCls}
                />
                {form.image && !imgError ? (
                  <div className="relative mt-3 h-36 w-full rounded-2xl overflow-hidden bg-blush-50">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={() => setImgError(true)}
                      unoptimized
                    />
                  </div>
                ) : form.image && imgError ? (
                  <div className="mt-3 h-20 rounded-2xl bg-blush-50 flex items-center justify-center gap-2 text-burgundy-700/40">
                    <ImageOff size={18} /> <span className="font-body text-sm">Invalid image URL</span>
                  </div>
                ) : null}
              </div>

              {/* Gallery (extra images) */}
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                  Extra gallery images
                </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => galleryFileRef.current?.click()}
                    disabled={uploadingGallery}
                    className="btn-blush inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                  >
                    {uploadingGallery ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={14} /> Upload one or more
                      </>
                    )}
                  </button>
                  <input
                    ref={galleryFileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </div>
                <textarea
                  value={form.gallery}
                  rows={3}
                  onChange={(e) => setForm((f) => ({ ...f, gallery: e.target.value }))}
                  placeholder={"…or paste URLs (one per line)"}
                  className={`${inputCls} resize-none font-mono text-sm`}
                />
                <p className="font-body text-xs text-burgundy-700/45 mt-1">
                  Optional. Shown as thumbnails on the product detail page alongside the main image.
                </p>
              </div>

              {/* Weight + Allergens */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      value={form.weight.replace(/\s*kg\s*$/i, "")}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                        setForm((f) => ({
                          ...f,
                          weight: raw ? `${raw} kg` : "",
                        }));
                      }}
                      placeholder="0.200"
                      className={`${inputCls} pr-12`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-burgundy-700/55 pointer-events-none select-none">
                      kg
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block font-body text-xs tracking-widest uppercase text-burgundy-700/65 mb-2">
                    Allergens
                  </label>
                  <input
                    value={form.allergens}
                    onChange={(e) => setForm((f) => ({ ...f, allergens: e.target.value }))}
                    placeholder="gluten, dairy, nuts"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle
                    checked={form.featured}
                    onChange={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  />
                  <span className="font-body text-sm text-burgundy-800">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle
                    checked={form.available}
                    onChange={() => setForm((f) => ({ ...f, available: !f.available }))}
                  />
                  <span className="font-body text-sm text-burgundy-800">Available for Purchase</span>
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-blush-50 border-t border-blush-100 px-7 py-4 flex flex-col gap-3">
              {saveError && (
                <p className="text-red-600 font-body text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
                  {saveError}
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-blush-200 rounded-full font-body text-sm hover:border-red-300 hover:text-red-400 transition-colors text-burgundy-800"
                >
                  <X size={13} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!form.name.en || !form.price || saving}
                  className="btn-primary flex items-center gap-2 px-7 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check size={13} /> {editId ? "Save Changes" : "Add Product"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-burgundy-800/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-blush-100">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="font-display text-2xl text-burgundy-800 font-medium mb-2">
              Delete product?
            </h3>
            <p className="font-body text-burgundy-700/55 mb-7">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 border border-blush-200 rounded-full font-body text-sm hover:border-burgundy-700/50 transition-colors text-burgundy-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-3 bg-red-500 text-white rounded-full font-body text-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
