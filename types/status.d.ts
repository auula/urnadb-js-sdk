export class SystemInfo {
    constructor(data: {
        key_count: number;
        gc_state: number;
        disk_free: string;
        disk_used: string;
        disk_total: string;
        mem_free: string;
        mem_total: string;
        disk_percent: string;
        space_total: string;
    });

    /** 当前数据库中存储的键数量 */
    readonly keyCount: number;

    /** 垃圾回收状态：0=初始, 1=执行中, 2=空闲 */
    readonly gcState: number;

    /** 磁盘剩余空间 */
    readonly diskFreeSpace: string;

    /** 已使用磁盘空间 */
    readonly diskUsedSpace: string;

    /** 磁盘总容量 */
    readonly diskTotalSpace: string;

    /** 系统可用内存 */
    readonly memoryFree: string;

    /** 系统总内存 */
    readonly memoryTotal: string;

    /** 磁盘使用百分比 */
    readonly diskUsagePercent: string;

    /** 数据库记录存储总量（逻辑空间） */
    readonly totalSpaceUsed: string;
}