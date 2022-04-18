
const form = document.getElementById("form");
const text = document.getElementById("prediction")

form.addEventListener("submit", submitForm);


function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();

    formData.append("name", name.value);
    formData.append("file", files.files[0])

    // for(let i =0; i < files.files.length; i++) {
    //         formData.append("files", files.files[i]);
    // }
    for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }

    // 1. synchrous way as follows won't print score value but a Promise.
    // const score = getMortalityScore(formData)
    // console.log(`received score: ${score}`)

    // 2. could not execute the callback function.
    // getMortalityScore(formData, (err, res) => {
    //     if (err) {
    //         console.log(`Error: ${err}`)
    //         return;
    //     }
        
    //     console.log(`data recevied from server: ${res}`)
    // })


    const settings = {
        method: 'POST',
        body: formData,
    };

    fetch(`http://localhost:7777/mortality_score`, settings)
    .then(res => {
        if (!res.ok) {
            throw new Error("Invalid input data")
        }
        return res.json()
    })
    .then(data => {
        console.log(`data: ${JSON.stringify(data)}`)
        let score = data.score[0]
        text.innerHTML = `${name.value}, your Mortality Score is ${score}`
    })
    .catch(err => {
        console.error(`Error in catch: ${err}`)
        text.innerHTML = `An error found: ${err}`
    })


    // getMortalityScore(formData)
    // .catch(err => {
    //     console.log(`received error: ${err}`)
    //     text.innerHTML = `An error found: ${res}`
    // })
    // .then(res => {
    //     console.log(`received score: ${res}`)
    //     text.innerHTML = `${name.value}, your Mortality Score is ${res}`
    // })

}