import copy from "copy-to-clipboard"
import { toast } from "react-toastify"


function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}

function randStr(len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

function putTokenConnectionScriptToClipboard(username, token) {
    let script = "";
    script += 'function login(token) {\n'
    script += '  setInterval(() => {\n'
    script += '    document.body.appendChild(\n'
    script += '      document.createElement`iframe`\n'
    script += '    ).contentWindow.localStorage.token = `"${token}"`;\n'
    script += '  }, 50);\n'
    script += '  setTimeout(() => {\n'
    script += '    location.reload();\n'
    script += '  }, 2500);\n'
    script += '}\n'
    script += '// * compte de <username>\n'
    script += 'login("<token>");\n'

    script = script.replace("<token>", token).replace("<username>", username);

    copy(script);
    toast("Copied to clipboard!");
}

export { randStr, putTokenConnectionScriptToClipboard };