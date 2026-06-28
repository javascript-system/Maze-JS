require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    const monacoDiv = document.getElementById("monacoDiv");
    if (!monacoDiv) return;
    if (monaco.languages.typescript && monaco.languages.typescript.javascriptDefaults) {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
            diagnosticCodesToIgnore: [7044, 7006]
        });

        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            checkJs: true,
            allowJs: true,
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            noImplicitAny: false,
            strictNullChecks: false,
            noLib: true,
            allowNonTsExtensions: true
        });

        monaco.languages.typescript.javascriptDefaults.addExtraLib(`
            /** Avança uma posição para frente. */
            declare function advance(): void;

            /** Gira 90 graus para a direita. */
            declare function rotate_right(): void;

            /** Gira 90 graus para a esquerda. */
            declare function rotate_left(): void;

            /** Dá meia volta (180 graus). */
            declare function rotate_halfTurn(): void;

            /** Retorna verdadeiro se o objetivo final ainda não foi alcançado. */
            declare function did_not_reach_the_end(): boolean;

            /**
             * Verifica se o caminho está livre na direção informada.
             * @param direction Direção a ser verificada. Valores aceitos: 'front', 'right', 'left', 'back'.
             */
            declare function path_is_clear(direction?: 'front' | 'right' | 'left' | 'back'): boolean;
        `, 'ts:mazejs/api.d.ts');
    }

    monacoEditorInstance = monaco.editor.create(monacoDiv, {
        value: `while (did_not_reach_the_end()) {\n\tif (path_is_clear('front')) {//advance when possible\n\t\tadvance(); \n\t} else if (path_is_clear('right')) { //rotate right when possible\n\t\trotate_right();\n\t} else { //rotate left when possible\n\t\trotate_left();\n\t}\n}`,
        language: "javascript",
        theme: 'vs',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordBasedSuggestions: false,
        suggest: {
            showKeywords: true,
            showWords: false,
            showColors: false,
            showFiles: false,
            showReferences: false,
            showSnippets: false,
            showClasses: false,
            showFunctions: true,
            showVariables: true,
            showConstants: false,
            showModules: false,
            showProperties: false,
            showInterfaces: false,
            showMethods: false,
            showConstructors: false,
            showEvents: false,
            showOperators: false,
            showUnits: false,
            showValues: false,
            showStructs: false,
            showInterfaces: false,
            showTypeParameters: false,
            showFolders: false,
            showEnums: false,
            showEnumMembers: false
        }
    });
});