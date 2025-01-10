export function getStrapiImage(
  serverURL: string | null,
  imageURL: string | null,
) {
  if (imageURL == null) return null;
  if (imageURL.startsWith("data:")) return imageURL;
  if (imageURL.startsWith("http") || imageURL.startsWith("//")) return imageURL;
  return serverURL + imageURL;
}
