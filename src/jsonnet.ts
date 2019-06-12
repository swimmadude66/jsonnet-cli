#!/usr/bin/env node
import {join, relative, basename} from 'path';
import {readdirSync, lstatSync, readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs';
import * as program from 'commander';
import { JsonnetCompiler } from './services/compiler';

// helper functions
function findFiles(root: string): string[] {
    let files = [];
    const f = readdirSync(root);
    f.forEach(fname => {
        const fullName = join(root, fname);
        try {
            const stats = lstatSync(fullName);
            if (!stats.isDirectory()) {
                if (/\.jsonnet/.test(fullName)) {
                    files.push(fullName);
                }
            } else {
                if (/node_modules/i.test(fullName)) {
                    return; // no node modules
                }
                files = [...files, ...findFiles(fullName)];
            }
        } catch (e) {
            return;
        }
    });
    return files;
}

// Services
const compiler = new JsonnetCompiler();

// Program
program
    .version('0.0.1', '-v, --version')
    .description('a cli-wrapper for the jsonnet compiler')
    .option('-i, --input <file, directory, or pattern>', 'Specify input files')
    .option('-o, --output <output file or directory>', 'Specify output location')
    .option('-y, --yaml', 'Output to yaml instead of json')
    .parse(process.argv);

const src = join(process.cwd(), program.input || './');
const output = join(process.cwd(), program.output || './');
const yamlOutput = program.yaml || false;
const outputExtension = yamlOutput ? '.yml' : '.json';
let files = [];

try {
    const srcStats = lstatSync(src);
    if (srcStats.isDirectory()) {
        files = findFiles(src);
    } else {
        files.push(src);
    }
} catch (e) {
    console.error('could not resolve input');
    process.exit(1);
}

let outputExists = true;
let outputDir = true;

try { 
    outputExists = existsSync(output);
    if (!outputExists) {
        outputExists = false;
        mkdirSync(output);
        outputExists = true;
    }
    const outputStats = lstatSync(output);
    outputDir = outputStats.isDirectory();
} catch (e) {
    console.error('Could not resolve output path');
    process.exit(2);
}

files.forEach(f => {
    const relFilename = (relative(src, f) || basename(f)).replace('.jsonnet', outputExtension);
    const code = readFileSync(f).toString();
    const outName = outputDir ? join(output, relFilename) : output;
    const formattedResult = compiler.compileCode(code, yamlOutput);
    writeFileSync(outName, formattedResult);
});
