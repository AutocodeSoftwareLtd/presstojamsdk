function importCSV(file) {
        return new Promise((resolve, reject) => {
            var fr = new FileReader();  
            fr.onload = () => {
                resolve(fr.result )
            };
            fr.onerror = reject;
            fr.readAsText(file.blob);
        })
        .then(data => {
            const headers = {};
            for(let i in data[0]) {
                headers[data[0][i]] = i;
            }

            for(let i = 1; i<data.length; ++i) {
                //run row based on the headers
            }
        });
    }






