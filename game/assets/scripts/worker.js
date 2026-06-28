self.onmessage = function(e) {
    const { jsCode, sab } = e.data;
    const ia = new Int32Array(sab);
    function sendCommandSync(actionType, param = null) {
        self.postMessage({ type: 'action', action: actionType, param: param });
        Atomics.wait(ia, 0, 0);
        const responseValue = ia[1];
        Atomics.store(ia, 0, 0);
        return responseValue;
    }
    const advance = () => { sendCommandSync('advance'); };
    const rotate_left = () => { sendCommandSync('rotate_left'); };
    const rotate_right = () => { sendCommandSync('rotate_right'); };
    const rotate_halfTurn = () => { sendCommandSync('rotate_halfTurn'); };
    const did_not_reach_the_end = () => { return sendCommandSync('checkEnd') === 1; };
    const path_is_clear = (direction) => { return sendCommandSync('checkPath', direction) === 1; };
    try {
        const runner = new Function(
            'advance', 'rotate_left', 'rotate_right', 'rotate_halfTurn', 'did_not_reach_the_end', 'path_is_clear', 
            jsCode
        );
        runner(advance, rotate_left, rotate_right, rotate_halfTurn, did_not_reach_the_end, path_is_clear);
        self.postMessage({ type: 'status', status: 'success' });
    } catch (err) {
        self.postMessage({ type: 'status', status: 'error', message: err.message });
    }
};