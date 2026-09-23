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
        this.keyCount = key_count;
        this.gcState = gc_state;
        this.diskFree = disk_free;
        this.diskUsed = disk_used;
        this.diskTotal = disk_total;
        this.memoryFree = mem_free;
        this.memoryTotal = mem_total;
        this.diskPercent = disk_percent;
        this.spaceTotalUsed = space_total;
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