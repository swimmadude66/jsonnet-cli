import {expect} from 'chai';
import {parse as yamlParse} from 'yaml';
import {JsonnetCompiler} from '../src/services/compiler';

const validJsonnet: string = `
    local fun(name = 'Kenobi') = 'Hello there, General ' + name;
    
    {
        meme: true,
        messages: [
            'this is a message',
            fun(),
            fun('World')
        ]
    }
`;

const invalidJsonnet: string = `
    This isn't jsonnet at all, this is just a string.
    Shopping list:
    - Beer
    - Cheese
    - Pretzles
    - Microwave
    - Beer?
`

const compiler = new JsonnetCompiler();

describe('Jsonnet compiler', () => {
    it('should convert valid jsonnet to valid json', () => {
        const json = compiler.compileCode(validJsonnet, false);
        const obj = JSON.parse(json);
        expect(obj).to.exist;
        expect(obj.meme).to.exist;
        expect(obj.meme).to.be.true;
        expect(obj.messages).to.exist;
        expect(Array.isArray(obj.messages)).to.be.true;
        expect(obj.messages.length).to.equal(3);
        expect(obj.messages[0]).to.equal('this is a message');
        expect(obj.messages[1]).to.equal('Hello there, General Kenobi');
        expect(obj.messages[2]).to.equal('Hello there, General World');
    });

    it('should convert valid jsonnet to valid yaml', () => {
        const yaml = compiler.compileCode(validJsonnet, true);
        const obj = yamlParse(yaml);
        expect(obj).to.exist;
        expect(obj.meme).to.exist;
        expect(obj.meme).to.be.true;
        expect(obj.messages).to.exist;
        expect(Array.isArray(obj.messages)).to.be.true;
        expect(obj.messages.length).to.equal(3);
        expect(obj.messages[0]).to.equal('this is a message');
        expect(obj.messages[1]).to.equal('Hello there, General Kenobi');
        expect(obj.messages[2]).to.equal('Hello there, General World');
    });

    it('should throw an error when parsing invalid jsonnet', () => {
        const badFn = function() {compiler.compileCode(invalidJsonnet)};
        expect(badFn).to.throw();
    });
});
