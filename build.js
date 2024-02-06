import path from "node:path";
import url from "node:url";

import {build} from "esbuild";
import {polyfillNode} from "esbuild-plugin-polyfill-node";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

build({
	entryPoints: [path.join(dirname, "./app.js")],
	bundle: true,
	outfile: path.join(dirname, "./docs/app.js"),
	plugins: [
		polyfillNode({}),
	],
});