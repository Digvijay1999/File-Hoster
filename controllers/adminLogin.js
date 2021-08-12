


function adminLogin(reqBody) {
    let result = await loginCreds.checker(req.body)
    console.log(result);
    if (result === 1) {
        res.send('1')
    } else {
        console.log('else');
        res.send('0')
    }
}
