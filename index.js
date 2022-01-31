console.log('hello')

const express = require('express');
const format = require('date-format');

const app = express()

const PORT =  process.env.PORT || 4000

app.get('/', (req,res) => {
    res.json({
        name: 'krishna',
        date: format.asString("dd[MM] - hh:mm:ss", new Date())
    })
    // res.send('hello')
})


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

