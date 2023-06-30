class Api {
    async getWords() {
        const res = await fetch('https://type.fit/api/quotes', {
            method: 'GET'
        })
        const json = await res.json()
        return json
    }
}

const api = new Api()

export { api }
