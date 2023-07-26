                Step1  : npm run dev
                step 2 : npm install cors

-->Copy and paste in index.js in backend part :

                const cors = require('cors')
                app.use(cors())

-->port our application uses at the bottom of the index.js file like so:

                const PORT = process.env.PORT || 3003
                app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`)
                })

##  Frontend production build

                step 1 : npm run build

-->Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL

                import axios from 'axios'

                <b>const baseUrl = '/api/persons'</b>

                const getAll = () => {
                const request = axios.get(baseUrl)
                return request.then(response => response.data)
                }

                // ...
