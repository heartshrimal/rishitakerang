import fs from "fs";
import path from "path";
import { products as defaultProducts } from "@/data/products";
import { categories as defaultCategories } from "@/data/products";

const STORE_DIR = path.join(process.cwd(), "data", "store");
const PRODUCTS_FILE = path.join(STORE_DIR, "products.json");
const CATEGORIES_FILE = path.join(STORE_DIR, "categories.json");

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  writeJSONSync(filePath, data);
}

function writeJSONSync(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getAllProducts() {
  const stored = readJSON(PRODUCTS_FILE);
  const merged = [...stored, ...defaultProducts];
  const seen = new Set();
  return merged.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function getProductById(id) {
  return getAllProducts().find((p) => p.id === Number(id));
}

export function addProduct(product) {
  const stored = readJSON(PRODUCTS_FILE);
  stored.push(product);
  writeJSONSync(PRODUCTS_FILE, stored);
}

export function getAllCategories() {
  const stored = readJSON(CATEGORIES_FILE);
  const merged = [...defaultCategories, ...stored];
  const seen = new Set();
  return merged.filter((c) => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
}

export function addCategory(category) {
  const stored = readJSON(CATEGORIES_FILE);
  stored.push(category);
  writeJSONSync(CATEGORIES_FILE, stored);
}

export function updateProduct(id, updates) {
  const stored = readJSON(PRODUCTS_FILE);
  const index = stored.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates, id: Number(id) };
  } else {
    const existing = getProductById(id);
    if (!existing) return false;
    stored.push({ ...existing, ...updates, id: Number(id) });
  }
  writeJSONSync(PRODUCTS_FILE, stored);
  return true;
}

export function deleteProduct(id) {
  const stored = readJSON(PRODUCTS_FILE);
  const filtered = stored.filter((p) => p.id !== Number(id));
  writeJSONSync(PRODUCTS_FILE, filtered);
}

export function getNextProductId() {
  const all = getAllProducts();
  return all.length > 0 ? Math.max(...all.map((p) => p.id)) + 1 : 1;
}
