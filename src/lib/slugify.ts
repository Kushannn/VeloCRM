import slugify from "slugify";

export const makeSlug = (text: string) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};
