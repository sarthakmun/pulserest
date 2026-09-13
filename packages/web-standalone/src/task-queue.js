// packages/web-standalone/src/task-queue.js
export default class TaskQueue {
    constructor() {
        this.queue = []
        this.running = false
    }

    async runNext() {
        if (this.running || this.queue.length === 0) return
        this.running = true
        const { task, resolve, reject } = this.queue.shift()
        try {
            resolve(await task())
        } catch (error) {
            reject(error)
            console.error('TaskQueue error', error)
        } finally {
            this.running = false
            this.runNext()
        }
    }

    enqueue(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject })
            this.runNext()
        })
    }
}
