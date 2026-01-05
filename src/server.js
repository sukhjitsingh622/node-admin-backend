require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');


const startServer = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log('DB connectd');

                app.listen(process.env.PORT || 5000, () => {
                    console.log('Server running on port 5000');
                });
            });
    } catch (error) {

        console.error(error);
        process.exit(1);
    }
}

startServer();