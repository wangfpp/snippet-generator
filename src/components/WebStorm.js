import React from "react";
import { html } from "common-tags";
import { Consumer } from "./Context";

const renderSnippet = (snippet, tabtrigger, description) => {
  // escape " with \"
  // split lines by line-break
  // const separatedSnippet = snippet
  //   .replace(/\\/g, "\\\\")
  //   .replace(/"/g, '\\"')
  //   // .split("\n");
  // const separatedSnippetLength = separatedSnippet.length;

  // add double quotes around each line apart from the last one
  // const newSnippet = separatedSnippet.map((line, index) => {
  //   return index === separatedSnippetLength - 1 ? `"${line}"` : `"${line}",`;
  // });
  function processString(input) {
    // 使用正则表达式匹配标签内的属性
    const attrPattern = /(\s+:(\w+)="([^"]*)")/g;
    const attrs = {};

    // 提取属性并替换字符串
    const formattedBody = input.replace(attrPattern, function(
      match,
      fullMatch,
      attrName,
      attrValue
    ) {
      attrs[attrName] = attrValue;
      return ` ${fullMatch.replace(
        `:${attrName}="${attrValue}"`,
        `:${attrName}="$${attrValue}$" `
      )} `;
    });

    const result = {
      body: formattedBody,
      attrs: Object.entries(attrs).map(([key, value]) => ({
        name: `:${key}`,
        value: value
      }))
    };

    return result;
  }

  function formatString(input) {
    let formatStr = processString(input);
    // eslint-disable-next-line no-console
    console.log(formatStr);
    return {
      body: escapeHtml(formatStr.body),
      attrs: formatStr.attrs
    };
  }

  function escapeHtml(input) {
    return input.replace(/[&<>"']/g, function(match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
      }
    });
  }
  let { body, attrs } = formatString(snippet);
  let variableStr = attrs
    .map(item => {
      return `<variable name="${item.value}" expression="" defaultValue="&quot;${item.value}&quot;" alwaysStopAt="true" />`;
    })
    .join("\r\n");
  // eslint-disable-next-line no-console
  console.log(body);
  // prettier-ignore
  return html`
    <templateSet group="Vue">
      <template 
        name="${tabtrigger}" 
        value="${body}
        description="${description}" 
        toReformat="true" 
        toShortenFQNames="true">
        ${variableStr}
        <context>
          <option name="VUE_TEMPLATE" value="true" />
        </context>
      </template>
  `;
};

const WebStorm = () => (
  <Consumer>
    {context => (
      <pre className="app__pre">
        {renderSnippet(
          context.state.snippet,
          context.state.tabTrigger,
          context.state.description
        )}
      </pre>
    )}
  </Consumer>
);

export default WebStorm;
