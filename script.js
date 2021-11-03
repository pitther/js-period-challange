const createElementWithInnerHtml = (tagName, innerHTML) => {
    if (!tagName || !innerHTML) return;
    const element = document.createElement(tagName);
    element.innerHTML = innerHTML;
    return element;
}

const writeListToHtmlElement = (list, selector) => {
    if (!list?.length || !selector) return;

    list.map(listElement => {
        return createElementWithInnerHtml('ul', listElement);
    }).forEach(element => {
        document.querySelector(selector).appendChild(element)
    });
}

const groupDaysBySameTime = (source) => {
    return source.order
        .map(dayName => {
            return {...source.days[dayName], day: dayName}
        })
        .reduce((groupedDays, day, index, days) => {
            const prevDay = index ? days[index - 1] : null;
            if (day.start && prevDay?.start === day?.start && prevDay?.end === day?.end) {
                groupedDays[groupedDays.length - 1].push(day)
                return [...groupedDays]
            }
            return [...groupedDays, [day]];
        }, [])
        .filter(group => group
            .reduce((isNotEmpty, day) => {
                if (isNotEmpty) return true;
                return day?.start
            }, false));
}

const normalizeTime = (time) => {
    return {
        hours: Math.floor(time > 12 ? time - 12 : time),
        minutes: Math.floor((time % 1) * 60),
        period: time > 12 ? 'PM' : 'AM'
    }
}

const normalizeGroupsTimeData = (groups) => {
    return [...groups].map(group => {
        return group.map(day => {
            return {
                ...day,
                day: day.day.slice(0, 3),
                start: normalizeTime(day.start),
                end: normalizeTime(day.end)
            };
        });
    })
}

const stringifyGroupsTime = (groups) => {
    return [...groups].map(group => {
        const pivotDay = group[0];
        const {start, end} = pivotDay;
        const daysLabel = group.length > 1 ? `${pivotDay.day} - ${group[group.length - 1].day}` : `${pivotDay.day}`;

        const timeLabel = `
        ${start.hours}:${start.minutes < 10 ? `0${start.minutes}` : start.minutes} 
        ${start.period} - 
        ${end.hours}:${end.minutes < 10 ? `0${end.minutes}` : end.minutes} 
        ${end.period}`

        return `${daysLabel}: ${timeLabel}`;
    })
}

const formatSource = (source) => {
    if (!source.order || !source.days) return;

    const groupedDaysRawData = groupDaysBySameTime(source);
    const normalizedTimeDataGroups = normalizeGroupsTimeData(groupedDaysRawData);

    return stringifyGroupsTime(normalizedTimeDataGroups);
}


writeListToHtmlElement(formatSource(source), `#box1 ul`);
writeListToHtmlElement(formatSource(source2), `#box2 ul`);
writeListToHtmlElement(formatSource(source3), `#box3 ul`);
