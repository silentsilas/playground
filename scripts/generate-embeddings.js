// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tf from '@tensorflow/tfjs-node';
import use from '@tensorflow-models/universal-sentence-encoder';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import { marked } from 'marked';

async function extractTextFromMarkdown(filePath) {
    const markdown = await fs.readFile(filePath, 'utf8');
		// remove yaml frontmatter metadata
		const result = markdown.replace(/---[\s\S]*?---/gm, '');
		// remove html tags
		const text = marked(result).replace(/<[^>]*>/g, '');
		return text;
}

async function generateEmbeddingsForDirectory(directoryPath) {
    // Get all markdown files in directory
    const files = glob.sync(`${directoryPath}/**/*.md`, {
			ignore: [`${directoryPath}/LICENSE.md`]
		});

    // Extract texts from markdown files
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const posts = await Promise.all(files.map(async (file, _index) => ({
        id: path.basename(file, '.md'),  // Use filename as ID,
        text: await extractTextFromMarkdown(file),
				section: path.basename(path.dirname(file)),
				filename: path.basename(file)
    })));

    // Load the Universal Sentence Encoder model
    const model = await use.load();
    const embeddings = await Promise.all(posts.map(post => model.embed([post.text])));

    // Map embeddings back to post objects
    const poemEmbeddings = posts.map((post, index) => ({
        id: post.id,
        vector: embeddings[index].arraySync()[0],  // Extract the vector
				section: post.section,
				filename: post.id
    }));

    // Save embeddings to JSON file
    fs.writeJson('embeddings.json', poemEmbeddings);
}

generateEmbeddingsForDirectory('src/posts');  // Update path accordingly
