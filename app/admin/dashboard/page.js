"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function ImageUploader({ images, setImages }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/images/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const url = prompt("Paste image URL:");
    if (url) setImages((prev) => [...prev, url]);
  }

  function remove(i) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-text">Images</label>
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-soft border border-border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        <label className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-accent transition-colors text-muted text-xl">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploading ? "..." : "+"}
        </label>
        <button
          type="button"
          onClick={addUrl}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-accent transition-colors text-muted text-lg"
        >
          🔗
        </button>
      </div>
    </div>
  );
}

function DetailInput({ details, setDetails }) {
  function update(i, value) {
    setDetails((prev) => prev.map((d, idx) => (idx === i ? value : d)));
  }

  function add() {
    setDetails((prev) => [...prev, ""]);
  }

  function remove(i) {
    setDetails((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text">Details</label>
      {details.map((d, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={d}
            onChange={(e) => update(i, e.target.value)}
            placeholder="e.g. Hand-sculpted polymer clay"
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none focus:border-accent transition-colors"
          />
          {details.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-red-500 transition-colors shrink-0"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-accent hover:text-primary transition-colors"
      >
        + Add detail
      </button>
    </div>
  );
}

function PreviewCard({ product }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface border border-border">
      <div className="aspect-square bg-soft flex items-center justify-center p-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-5 space-y-2">
        <span className="inline-block text-xs uppercase tracking-wider text-muted font-medium">
          {product.category}
        </span>
        <h3 className="font-display text-lg text-text">{product.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-semibold text-text">
            ₹{product.price}
          </span>
          <span className="text-sm font-medium text-accent">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ categories: cats, onProductAdded, editProduct, onEditDone }) {
  const [name, setName] = useState(editProduct?.name || "");
  const [category, setCategory] = useState(editProduct?.category || cats[0]?.name || "");
  const [price, setPrice] = useState(editProduct?.price || "");
  const [description, setDescription] = useState(editProduct?.description || "");
  const [images, setImages] = useState(editProduct?.images || []);
  const [details, setDetails] = useState(editProduct?.details?.length ? editProduct.details : [""]);
  const [featured, setFeatured] = useState(editProduct?.featured || false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = !!editProduct;

  const previewProduct = {
    name: name || "Product Name",
    category: category,
    price: price || "0",
    image: images[0] || "https://placehold.co/400x400/f5ede4/8a7a6e?text=No+Image",
    images,
    description,
    details: details.filter(Boolean),
    featured,
  };

  async function handleConfirm() {
    setSaving(true);

    const token = localStorage.getItem("admin_token");
    const cat = cats.find((c) => c.name === category);
    const slug = cat?.slug || category.toLowerCase().replace(/\s+/g, "-");

    const payload = {
      name,
      category,
      slug,
      price,
      images,
      description,
      details: details.filter(Boolean),
      featured,
    };

    try {
      const res = isEditing
        ? await fetch(`/api/products/${editProduct.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        setName("");
        setPrice("");
        setDescription("");
        setImages([]);
        setDetails([""]);
        setShowPreview(false);
        onProductAdded?.();
        if (isEditing) onEditDone?.();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  if (showPreview) {
    return (
      <div className="space-y-6">
        <h3 className="font-display text-lg text-text">Preview</h3>
        <PreviewCard product={previewProduct} />
        {description && (
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        )}
        {details.filter(Boolean).length > 0 && (
          <ul className="space-y-2">
            {details.filter(Boolean).map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(false)}
            className="flex-1 rounded-2xl border border-border py-3.5 text-text font-medium text-sm hover:bg-soft transition-colors"
          >
            ← Back to Edit
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 rounded-2xl bg-text py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditing ? "Update Product" : "Confirm & Post"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowPreview(true);
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
        >
          {cats.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
          required
          min="0"
        />
      </div>

      <ImageUploader images={images} setImages={setImages} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      <DetailInput details={details} setDetails={setDetails} />

      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-10 h-6 rounded-full transition-colors ${featured ? "bg-accent" : "bg-border"}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${featured ? "translate-x-[18px]" : "translate-x-0.5"}`} />
          </div>
        </div>
        <span className="text-sm text-text">Show in Featured Creations</span>
      </label>

      <button
        type="submit"
        className="w-full rounded-2xl bg-text py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Preview
      </button>
    </form>
  );
}

function CategoryForm({ onAdded }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, icon, description }),
      });

      if (res.ok) {
        setDone(true);
        setName("");
        setDescription("");
        onAdded?.();
        setTimeout(() => setDone(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Category Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Icon (emoji)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
          maxLength={2}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {done && <p className="text-sm text-green-600">Category added!</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl bg-text py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Category"}
      </button>
    </form>
  );
}

function ManageProducts({ onRefresh, onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);

    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        onRefresh?.();
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  }

  async function handleToggleFeatured(product) {
    setToggling(product.id);
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured: !product.featured }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
        );
      }
    } catch {
      // ignore
    } finally {
      setToggling(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted text-center py-8">Loading...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        No products yet. Add your first one!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-4"
        >
          <div className="w-14 h-14 rounded-xl bg-soft shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={p.image}
              alt=""
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">{p.name}</p>
            <p className="text-xs text-muted">
              {p.category} · ₹{p.price}
            </p>
          </div>
          <button
            onClick={() => handleToggleFeatured(p)}
            disabled={toggling === p.id}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors shrink-0 disabled:opacity-50 ${
              p.featured
                ? "border-accent/30 text-accent bg-accent/5"
                : "border-border text-muted hover:border-accent/30"
            }`}
            title={p.featured ? "Remove from Featured" : "Add to Featured"}
          >
            {toggling === p.id ? "..." : "★"}
          </button>
          <button
            onClick={() => onEdit?.(p)}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/30 transition-colors shrink-0"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            disabled={deleting === p.id}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-red-500 hover:border-red-200 transition-colors shrink-0 disabled:opacity-50"
          >
            {deleting === p.id ? "..." : "×"}
          </button>
        </div>
      ))}
    </div>
  );
}

function PaymentsView() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  async function handleConfirm(id) {
    setConfirming(id);
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "PATCH" });
      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
    } finally {
      setConfirming(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted text-center py-8">Loading...</p>;
  }

  if (payments.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        No pending payments.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl bg-surface border border-border p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text">{p.name}</p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full font-medium">
              {p.status}
            </span>
          </div>
          <p className="text-xs text-muted">
            {p.product_name} · ₹{p.product_price}
          </p>
          <p className="text-xs text-muted">
            Phone: {p.phone}
            {p.razorpay_payment_id
              ? ` · Razorpay: ${p.razorpay_payment_id}`
              : p.utr
              ? ` · UTR: ${p.utr}`
              : ""}
          </p>
          <p className="text-xs text-muted/60">
            {new Date(p.created_at).toLocaleString()}
          </p>
          <button
            onClick={() => handleConfirm(p.id)}
            disabled={confirming === p.id}
            className="w-full rounded-xl bg-green-600 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {confirming === p.id ? "..." : "✓ Mark Confirmed"}
          </button>
        </div>
      ))}
    </div>
  );
}

function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((all) => setOrders(all.filter((p) => p.status === "confirmed")))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted text-center py-8">Loading...</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-8">
        No confirmed orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o.id}
          className="rounded-2xl bg-surface border border-border p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text">{o.name}</p>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">
              Confirmed
            </span>
          </div>
          <p className="text-xs text-muted">
            {o.product_name} · ₹{o.product_price}
          </p>
          <p className="text-xs text-muted">
            Phone: {o.phone}
            {o.razorpay_payment_id
              ? ` · Payment: ${o.razorpay_payment_id}`
              : o.utr
              ? ` · UTR: ${o.utr}`
              : ""}
          </p>
          <p className="text-xs text-muted/60">
            {new Date(o.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

function BannerEditor() {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/banner")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {});
  }

  useEffect(load, []);

  function token() {
    return localStorage.getItem("admin_token");
  }

  function api(body) {
    return fetch("/api/banner", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify(body),
    });
  }

  async function add() {
    setSaving(true);
    try {
      await api({ action: "add", text: "" });
      load();
      window.dispatchEvent(new Event("banner-update"));
    } catch {}
    setSaving(false);
  }

  async function update(id, text) {
    await api({ action: "update", id, text });
    load();
    window.dispatchEvent(new Event("banner-update"));
  }

  async function remove(id) {
    setSaving(true);
    try {
      await api({ action: "delete", id });
      load();
      window.dispatchEvent(new Event("banner-update"));
    } catch {}
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Edit the scrolling banner messages.</p>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 items-start">
          <input
            type="text"
            defaultValue={item.text}
            onBlur={(e) => {
              if (e.target.value !== item.text) update(item.id, e.target.value);
            }}
            placeholder="Banner text"
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none focus:border-accent transition-colors"
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted hover:text-red-500 transition-colors shrink-0"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        disabled={saving}
        className="text-sm text-accent hover:text-primary transition-colors disabled:opacity-50"
      >
        + Add banner item
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState("product");
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("admin_token");
          router.replace("/admin");
          return;
        }

        setAuthed(true);
      } catch {
        router.replace("/admin");
      } finally {
        setChecking(false);
      }
    }

    check();
  }, [router]);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, [authed]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    router.replace("/admin");
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setTab("product");
  }

  function handleEditDone() {
    setEditingProduct(null);
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted text-sm">Checking...</p>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto flex h-16 items-center justify-between px-5">
          <h1 className="font-display text-lg text-text">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-text transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-5 pt-6 pb-20">
        <div className="flex gap-2 mb-8">
          {["product", "manage", "payments", "orders", "category", "banner"].map((t) => (
            <button
              key={t}
              onClick={() => {
                if (t === "product" && editingProduct) setEditingProduct(null);
                setTab(t);
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-text text-background"
                  : "bg-surface text-muted border border-border"
              }`}
            >
              {t === "product"
                ? editingProduct ? "Edit" : "Add"
                : t === "manage" ? "Manage"
                : t === "payments" ? "Payments"
                : t === "orders" ? "Orders"
                : t === "category" ? "Category"
                : "Banner"}
            </button>
          ))}
        </div>

        {tab === "product" && (
          <ProductForm
            key={editingProduct?.id || "new"}
            categories={categories}
            editProduct={editingProduct}
            onEditDone={handleEditDone}
            onProductAdded={() => {
              fetch("/api/categories")
                .then((r) => r.json())
                .then(setCategories);
            }}
          />
        )}

        {tab === "manage" && (
          <ManageProducts
            onEdit={handleEdit}
            onRefresh={() => {
              fetch("/api/categories")
                .then((r) => r.json())
                .then(setCategories);
            }}
          />
        )}

        {tab === "payments" && <PaymentsView />}

        {tab === "orders" && <OrdersView />}

        {tab === "category" && (
          <CategoryForm
            onAdded={() =>
              fetch("/api/categories")
                .then((r) => r.json())
                .then(setCategories)
            }
          />
        )}

        {tab === "banner" && <BannerEditor />}
      </div>
    </div>
  );
}
