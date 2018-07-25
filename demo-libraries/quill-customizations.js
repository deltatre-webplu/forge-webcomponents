// CUSTOM QUILL CODE AS FOUND INSIDE FORGE

(function () {

    // setting up custom icon for split functionality
    const icons = Quill.import('ui/icons');
    icons['split'] = '<i class="fa fa-sort" aria-hidden="true"></i>';

    /*
     * We need to change QuillJs behaviour of br handling.
     * Forge editors want to be able to insert a break inside a paragraph
     * when hitting Shift+Enter (Word-like behaviour)
     *
     * https://github.com/quilljs/quill/issues/252#issuecomment-288884372
     */
    const QuillDelta = Quill.import('delta');
    const quillEmbed = Quill.import('blots/embed');
    const Break = Quill.import('blots/break');

    class CustomBreak extends Break { };

    CustomBreak.blotName = 'customBreak';
    CustomBreak.tagName = 'br';

    CustomBreak.prototype.insertInto = function (parent, ref) {
        quillEmbed.prototype.insertInto.call(this, parent, ref);
    };
    CustomBreak.prototype.length = function () {
        return 1;
    };
    CustomBreak.prototype.value = function () {
        return '\n';
    };

    Quill.register(CustomBreak);

    /*******/

    /*
     * we use a quill object (quillConverter) to be able to translate deltas to html
     * when splitting story parts. 
     */
    const quillConverterDiv = document.createElement('div');
    const quillConverter = new Quill(quillConverterDiv);

    function quillDeltaToHtml(delta) {
        quillConverter.setContents(delta);
        return quillConverterDiv.getElementsByClassName('ql-editor')[0].innerHTML;
    }
    /***********/


})();