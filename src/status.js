export class SystemInfo {

    #key_count;
    #gc_state;
    #disk_free;
    #disk_used;
    #disk_total;
    #mem_free;
    #mem_total;
    #disk_percent;
    #space_total;

    constructor({
        key_count,
        gc_state,
        disk_free,
        disk_used,
        disk_total,
        mem_free,
        mem_total,
        disk_percent,
        space_total,
    }) {
        this.#key_count = key_count;
        this.#gc_state = gc_state;
        this.#disk_free = disk_free;
        this.#disk_used = disk_used;
        this.#disk_total = disk_total;
        this.#mem_free = mem_free;
        this.#mem_total = mem_total;
        this.#disk_percent = disk_percent;
        this.#space_total = space_total;
    }

    get keyCount() {
        return this.#key_count;
    }

    get gcState() {
        return this.#gc_state;
    }

    get diskFreeSpace() {
        return this.#disk_free;
    }

    get diskUsedSpace() {
        return this.#disk_used;
    }

    get diskTotalSpace() {
        return this.#disk_total;
    }

    get memoryFree() {
        return this.#mem_free;
    }

    get memoryTotal() {
        return this.#mem_total;
    }

    get diskUsagePercent() {
        return this.#disk_percent;
    }

    get totalSpaceUsed() {
        return this.#space_total;
    }

}