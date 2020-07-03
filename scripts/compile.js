const localOutDirs = ['./dist'];

const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');

// make sure we're in the right folder
// process.chdir(path.resolve(__dirname, '..'));
process.chdir(path.resolve());

fs.removeSync('.build.es5');
fs.removeSync('.build.es6');
fs.removeSync('dist');

/**
 * 批量执行ts编译，在多个目录生成.js .d.ts
 * @param localOutDirs
 * @param target
 * @param declarations
 */
function batchRunTSBuild (localOutDirs, target, declarations) {
    if (!Array.isArray(localOutDirs)) {
        console.error(
            'Running typescript build, param localOutDirs should be Array!'
        );
        return;
    }
    let isSuccess = false;
    localOutDirs.forEach(outDir => {
        isSuccess = runTypeScriptBuild(outDir, target, declarations);
    });
    console.log(
        `Running typescript build ${
            isSuccess ? 'Success (*￣︶￣)' : 'Fail o(╥﹏╥)o'
        }.`
    );
}

function runTypeScriptBuild (outDir, target, declarations) {
    console.log(
        `Running typescript build (target: ${ts.ScriptTarget[target]}) in ${outDir}/`
    );

    const tsConfig = path.resolve('tsconfig.json');
    const json = ts.parseConfigFileTextToJson(
        tsConfig,
        ts.sys.readFile(tsConfig),
        true
    );

    const { options } = ts.parseJsonConfigFileContent(
        json.config,
        ts.sys,
        path.dirname(tsConfig)
    );

    options.target = target;
    options.outDir = outDir;
    options.declaration = declarations;

    options.module = ts.ModuleKind.ES2015;
    //若是需要.d.ts文件，则设置生成.d.ts的目录
    if (declarations) {
        options.declarationDir = outDir;
    }

    const rootFile = path.resolve('src', 'index.ts');
    const host = ts.createCompilerHost(options, true);
    const prog = ts.createProgram([rootFile], options, host);
    const result = prog.emit();

    if (result.emitSkipped) {
        const message = ts.formatDiagnostics(result.diagnostics, {
            getCurrentDirectory () {
                return '.';
            },
            getCanonicalFileName (fileName) {
                return fileName;
            },
            getNewLine () {
                return '\n';
            }
        });
        throw new Error(`Failed to compile typescript:\n\n${message}`);
    }
    return true;
}

try {
    batchRunTSBuild(localOutDirs, ts.ScriptTarget.ES2017, true);
} catch (err) {
    console.error(err);
    if (err.frame) {
        console.error(err.frame);
    }
    process.exit(1);
}
