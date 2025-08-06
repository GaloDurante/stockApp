export function getPaginationPages(currentPage: number, totalPages: number, maxPagesToShow = 5): (number | 'dots')[] {
    const pages: (number | 'dots')[] = [];

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    const half = Math.floor(maxPagesToShow / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start <= 1) {
        start = 1;
        end = maxPagesToShow;
    }

    if (end >= totalPages) {
        start = totalPages - maxPagesToShow + 1;
        end = totalPages;
    }

    pages.push(1);
    if (start > 2) {
        pages.push('dots');
    }

    for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
            pages.push(i);
        }
    }

    if (end < totalPages - 1) {
        pages.push('dots');
    }
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}

export function mapOptions<T>(
    items: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    includeAllOption = false,
    allLabel = 'Todas'
) {
    const mapped = items.map((item) => ({
        value: getValue(item),
        label: getLabel(item),
    }));

    if (includeAllOption) {
        return [{ value: '', label: allLabel }, ...mapped];
    }

    return mapped;
}

export function getSelectedOption(options: { value: string; label: string }[], selectedValue: string | null) {
    return options.find((o) => o.value === selectedValue) ?? null;
}

export function buildQueryParams(params: Record<string, string | undefined>) {
    const query = new URLSearchParams();
    for (const key in params) {
        const value = params[key];
        if (value) query.set(key, value);
    }
    return query.toString();
}
