const memberShip = {
    pro:{
        price:99,
        expiry: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000)
    },
    super:{
        price:199,
        expiry: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
    }
}

module.exports = memberShip