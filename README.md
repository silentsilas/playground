# Playground

Portfolio site of silentsilas

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Generate Embeddings

To create vector embeddings for searching through Markdown posts, simply run:

```
npm run generate-embeddings
```

It will traverse through every `*.md` under `src/posts/poetry` and generate the embeddings. You would then place the `embeddings.json` in the `src/lib/utils/poetry` to let the site run semantic search queries against them.

## License

This project is licensed under the [MIT License](src/branch/main/LICENSE). This means that you can do pretty much anything you want with this code as long as you include the original copyright and license notice in your project.

Content contained in the `src/posts` folder is under the [CC BY-NC-SA-4.0](src/branch/main/src/posts/LICENSE) license. You're free to modify/distribute the posts contained in the `src/posts` folder so long as it's not for commercial purposes, you give attribution, and point out any modifications you've made.
