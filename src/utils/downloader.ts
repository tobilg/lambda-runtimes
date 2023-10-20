import axios from "axios";
import { parse } from "node-html-parser";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();

export const downloadMarkdownAsHTML = async (url: string) => {
  try {
    const response = await axios.get(url);
    const rawHTML = md.render(response.data);
    return (parse(rawHTML) as unknown as HTMLElement);
  } catch (error) {
    console.error(error);
  }
}

export const downloadAsHTML = async (url: string) => {
  try {
    const response = await axios.get(url);
    return (parse(response.data) as unknown as HTMLElement);
  } catch (error) {
    console.error(error);
  }
}
