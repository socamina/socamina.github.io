const UTILS = {
    DeferredPromise() {
        let res;
        let rej;
        let p = new Promise(function(resolve, reject) {
            res = resolve;
            rej = reject;
        });

        p._state = 'pending';

        p._resolve = a => {
            p._state = 'resolved';
            res.call(a);
        }

        p._reject = a => {
            p._state = 'rejected';
            rej.call(a);
        }

        return p;
    },


    getClosestInArray(number, array) {
        let distance = Math.abs(array[0] - number);
        let idx = 0;
        for (let c = 1; c < array.length; c++) {
            let cdistance = Math.abs(array[c] - number);
            if (cdistance < distance) {
                idx = c;
                distance = cdistance;
            }
        }
        return idx;
    }
}