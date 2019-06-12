import * as Jsonnet from '@rbicker/jsonnet';
import {stringify as yamlStringify} from 'json2yaml';

export class JsonnetCompiler {
    
    private _compiler;

    constructor() {
        this._compiler = new Jsonnet(); 
    }
 
    compileCode(code: string, yamlOutput: boolean = false): string {
        const result = this._compiler.eval(code);
        let formattedResult: string;
        if (yamlOutput) {
            formattedResult = yamlStringify(result);
        } else {
            formattedResult = JSON.stringify(result);
        }
        return formattedResult;
    }
}
