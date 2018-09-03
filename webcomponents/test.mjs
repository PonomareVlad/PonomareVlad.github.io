import {test} from './depend.mjs';

export function init() {
    document.body.innerText = 'Work!';
    test();
}