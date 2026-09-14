import { type SchemaTypeDefinition } from "sanity";

import { author } from "./documents/author";
import { category } from "./documents/category";
import { post } from "./documents/post";
import { button } from "./objects/button";
import { footerColumn } from "./objects/footerColumn";
import { imageWithAlt } from "./objects/imageWithAlt";
import { link } from "./objects/link";
import { metadata } from "./objects/metadata";
import { portableText, simplePortableText } from "./objects/portableText";
import { quote } from "./objects/quote";
import { blogPage } from "./singletons/blogPage";
import { homePage } from "./singletons/homePage";
import { layout } from "./singletons/layout";

export const singletonTypes = new Set<string>([layout.name, homePage.name, blogPage.name]);

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    link,
    button,
    imageWithAlt,
    footerColumn,
    metadata,
    quote,
    simplePortableText,
    portableText,
    // Documents
    post,
    author,
    category,
    // Singletons
    layout,
    homePage,
    blogPage,
  ],
};
