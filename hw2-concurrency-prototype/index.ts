class MyBuffer {
    private buffer: number[];
    private maxSize: number;

    constructor(maxSize: number) {
        this.buffer = [];
        this.maxSize = maxSize;
    }

    public async produce(item: number): Promise<void> {
        while (this.buffer.length === this.maxSize) {
            console.log('Buffer is full. Waiting for consumer...');
            await this.sleep(100); // Wait for 100ms before checking again
        }

        this.buffer.push(item);
        console.log(`Produced item: ${item}`);
    }

    public async consume(): Promise<number | undefined> {
        while (this.buffer.length === 0) {
            console.log('Buffer is empty. Waiting for producer...');
            await this.sleep(100); // Wait for 100ms before checking again
        }

        const item = this.buffer.shift();
        if (item !== undefined) {
            console.log(`Consumed item: ${item}`);
        }

        return item;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Producer {
    private buffer: MyBuffer;

    constructor(buffer: MyBuffer) {
        this.buffer = buffer;
    }

    public async produceItems(): Promise<void> {
        while (true) {
            const item = Math.floor(Math.random() * 100);
            await this.buffer.produce(item);
            await this.sleep(1000); // Produce an item every 1 second
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Consumer {
    private buffer: MyBuffer;

    constructor(buffer: MyBuffer) {
        this.buffer = buffer;
    }

    public async consumeItems(): Promise<void> {
        while (true) {
            await this.buffer.consume();
            await this.sleep(2000); // Consume an item every 2 seconds
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Usage example
const buffer = new MyBuffer(5);
const producer = new Producer(buffer);
const consumer = new Consumer(buffer);

producer.produceItems();
consumer.consumeItems();