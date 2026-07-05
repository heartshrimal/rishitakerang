import { supabase } from "./supabase";

export async function getAllProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });
  return data || [];
}

export async function getProductById(id) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", Number(id))
    .single();
  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", Number(id))
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", Number(id));
  if (error) throw error;
}

export async function getAllCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });
  return data || [];
}

export async function addCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Payments
export async function getAllPayments() {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .order("id", { ascending: false });
  return data || [];
}

export async function getPaymentById(id) {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("id", Number(id))
    .single();
  return data;
}

export async function addPayment(payment) {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePayment(id, updates) {
  const { data, error } = await supabase
    .from("payments")
    .update(updates)
    .eq("id", Number(id))
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Banner
export async function getBannerItems() {
  const { data } = await supabase
    .from("banner_items")
    .select("*")
    .order("position", { ascending: true })
    .order("id", { ascending: true });
  return data || [];
}

export async function addBannerItem(text, position) {
  const { data, error } = await supabase
    .from("banner_items")
    .insert({ text, position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBannerItem(id, text) {
  const { data, error } = await supabase
    .from("banner_items")
    .update({ text })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBannerItem(id) {
  const { error } = await supabase
    .from("banner_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
