/*
 Copyright 2012-2015, Yahoo Inc.
 Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 Based on the
 */
'use strict';
const { ReportBase } = require('istanbul-lib-report');

class TextSimpleReport extends ReportBase {
    constructor(opts) {
        super();

        opts = opts || {};
        this.file = opts.file || null;
    }

    onStart(node, context) {
        const summary = node.getCoverageSummary();
        const cw = context.writer.writeFile(this.file);
        const printLine = function(key) {
            const str = lineForKey(summary, key);
            const clazz = context.classForPercent(key, summary[key].pct);
            cw.println(cw.colorize(str, clazz));
        };

        const checks = Object.keys(summary);
        if(checks.reduce((accumulator, currentValue) => ((accumulator + currentValue))) / checks.length === 100) {
            cw.println('100% coverage');
        }
        else {
            printLine('statements');
            printLine('branches');
            printLine('functions');
            printLine('lines');
        }

        cw.close();
    }
}

function lineForKey(summary, key) {
    const metrics = summary[key];

    key = key.substring(0, 1).toUpperCase() + key.substring(1);
    if (key.length < 12) {
        key += '                   '.substring(0, 12 - key.length);
    }
    const result = [
        key,
        ':',
        metrics.pct + '%',
        '(',
        metrics.covered + '/' + metrics.total,
        ')'
    ].join(' ');
    const skipped = metrics.skipped;
    if (skipped > 0) {
        return result + ', ' + skipped + ' ignored';
    }
    return result;
}

module.exports = TextSimpleReport;
