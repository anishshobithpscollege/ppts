---
theme: ../../templates/msis-seminar
title: HTTP QUERY Method
author: Anish Shobith
info: |
  HTTP QUERY Method: A Security-Focused Literature Survey and Analysis.
  M.E. CyberSecurity technical seminar, Manipal School of Information Sciences, MAHE, Manipal.
  Built on the MSIS Seminar Template 2026-27 (order, fonts and colours kept), widened to 16:9.
duration: 18min
exportFilename: HTTP_QUERY_CyberSecurity_Seminar
download: true
layout: title
kind: Technical Seminar
heading:
  - 'HTTP QUERY Method:'
  - A Security-Focused Literature Survey and Analysis
regno: Registration Number
programme: M.E. CyberSecurity
panel:
  - { role: 'Panel Member 1:', name: Name, designation: Designation }
  - { role: 'Panel Member 2:', name: Name, designation: Designation }
---

<!--
⏱ 0:20 (ends 0:20) · Source: RFC 10008

SAY: Good morning. My seminar is on the HTTP QUERY method, published as RFC 10008 in June 2026, so it is only a few months old. I'll build up from HTTP basics to what QUERY is. Most of my time goes on the security and deployment questions it raises, and I'll finish with the literature.

NEXT → Here is the outline.
-->

---
layout: outline
items:
  - 'Introduction: HTTP methods, URIs and the GET / POST semantic gap'
  - Objectives
  - 'Literature Review: standards and peer-reviewed studies'
  - 'Description: the QUERY method (RFC 10008) and its security analysis'
  - Conclusion
---

<!--
⏱ 0:20 (ends 0:40)

SAY: The talk follows the seminar format. The Introduction covers the HTTP fundamentals and ends with the problem: the gap between GET and POST. Then my objectives, and a literature review of the standards and the peer-reviewed work. The Description is the core: what QUERY is, how it compares with GET and POST, and its security implications across caches, browsers, signatures and deployment. Then the conclusion.

NEXT → Let's start with the most basic question: why does HTTP have methods at all?
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 3
---

# Why do HTTP request methods exist?

<p class="txt">The method is the primary source of request semantics: it tells <b>every hop</b> what the client intends. <Cite r="9110" s="9.1" /></p>
<div class="s3">
  <div class="s3-sets">
    <div class="s3-idem" :class="{ lit: $clicks >= 2 }">
      <div class="s3-lab">Idempotent</div>
      <div class="s3-row"><M t="PUT" /><M t="DELETE" /></div>
      <div class="s3-safe" :class="{ lit: $clicks >= 1 }">
        <div class="s3-lab">Safe</div>
        <div class="s3-row"><M t="GET" /><M t="HEAD" /><M t="OPTIONS" /></div>
      </div>
    </div>
    <div class="s3-none" :class="{ lit: $clicks >= 3 }">
      <div class="s3-lab">Neither</div>
      <div class="s3-row"><M t="POST" /><M t="PATCH" /></div>
    </div>
  </div>
  <ul class="bul s3-why">
    <li v-click="1"><b>Safe</b>: no state change is requested, so caches, prefetchers and crawlers can send it freely <Cite r="9110" s="9.2.1" /></li>
    <li v-click="2"><b>Idempotent</b>: repeating it has the same intended effect, so a client may retry after a lost connection <Cite r="9110" s="9.2.2" /></li>
    <li v-click="3"><b>Neither</b>: no blind retries; a proxy <b>MUST NOT</b> retry these automatically <Cite r="9110" s="9.2.2" /></li>
  </ul>
</div>

<style>
.s3 { display: grid; grid-template-columns: 400px 1fr; gap: 28px; margin-top: 16px; }
.s3-sets { display: flex; flex-direction: column; gap: 12px; }
.s3-idem, .s3-safe, .s3-none { border: 1.5px solid var(--indigo); padding: 8px 12px 12px; background: #fff; transition: background .4s ease; }
.s3-safe { margin-top: 10px; }
.s3-idem.lit { background: var(--teal-t); }
.s3-safe.lit { background: var(--lav); }
.s3-none { border-style: dashed; }
.s3-none.lit { border: 2px solid var(--brown); }
.s3-lab { font-size: 18px; font-weight: 700; color: var(--brown); margin-bottom: 6px; }
.s3-row { display: flex; gap: 8px; flex-wrap: wrap; }
.s3-row .mpill { font-size: 20px; padding: 1px 9px; }
.s3-why > li { font-size: 21px; margin-top: 10px; }
</style>

<!--
⏱ 0:50 (ends 1:30) · Sources: RFC 9110 §9.1, §9.2.1, §9.2.2

SAY: HTTP could have used one generic "send this" operation. It doesn't, because the method tells every party on the path what the client intends: the browser, the cache, the proxy and the server. RFC 9110 calls the method "the primary source of request semantics". What matters is not the list of methods but two properties behind it.

[click] First, safe. GET, HEAD and OPTIONS are safe: the client is not asking for any state change, so a cache, a prefetcher or a crawler can send them without asking anyone.

[click] Second, idempotent. PUT, DELETE, and every safe method are idempotent. Sending the request twice has the same intended effect as once, so a client can retry after a dropped connection.

[click] POST and PATCH are neither. RFC 9110 says a proxy MUST NOT retry non-idempotent requests automatically.

CLARIFY: Safe methods are a subset of idempotent methods, which is why the Safe box sits inside the Idempotent box. TRACE is also safe but rarely enabled.

NOTICE: Where a method sits in this picture decides what intermediaries may do with it. QUERY will end up inside the Safe box.

NEXT → What one of these requests looks like on the wire.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 7
---

# Anatomy of an HTTP exchange

<div class="s4">
  <div>
    <div class="panel-title">Request</div>
    <div class="msg">
      <div class="ln"><span class="part" :class="{ now: $clicks === 1, on: $clicks > 1 }">GET</span><span class="num">1</span> <span class="part" :class="{ now: $clicks === 2, on: $clicks > 2 }">/products?category=laptop</span><span class="num">2</span> <span class="h">HTTP/1.1</span></div>
      <div class="part" :class="{ now: $clicks === 3, on: $clicks > 3 }"><div class="ln h">Host: example.com<span class="num">3</span></div><div class="ln h">Accept: application/json</div><div class="ln h">Authorization: Bearer eyJhbGci…</div></div>
      <div class="ln"> </div>
      <div class="ln"><span class="part h" :class="{ now: $clicks === 4, on: $clicks > 4 }"><i>(no content)</i></span><span class="num">4</span></div>
    </div>
  </div>
  <div>
    <div class="panel-title">Response</div>
    <div class="msg">
      <div class="ln"><span class="part" :class="{ now: $clicks === 5, on: $clicks > 5 }">HTTP/1.1 200 OK</span><span class="num">5</span></div>
      <div class="ln h"><span class="part" :class="{ now: $clicks === 6, on: $clicks > 6 }">Content-Type: application/json</span></div>
      <div class="ln"> </div>
      <div class="part" :class="{ now: $clicks === 6, on: $clicks > 6 }"><div class="ln">{<span class="num">6</span></div><div class="ln">  "results": [ … ]</div><div class="ln">}</div></div>
    </div>
  </div>
</div>
<div class="legend s4-leg">
  <div v-click="1"><span class="num">1</span><b>Method</b>: what the client intends</div>
  <div v-click="4"><span class="num">4</span><b>Content (body)</b>: none; GET content has no defined semantics <Cite r="9110" s="9.3.1" /></div>
  <div v-click="2"><span class="num">2</span><b>Target</b>: URI of the resource, including its query</div>
  <div v-click="5"><span class="num">5</span><b>Status line</b>: the outcome, as a code</div>
  <div v-click="3"><span class="num">3</span><b>Headers</b>: metadata, credentials, formats</div>
  <div v-click="6"><span class="num">6</span><b>Response headers + content</b>: the result</div>
</div>

<style>
.s4 { display: grid; grid-template-columns: 500px 1fr; gap: 24px; }
.s4 .msg { font-size: 17px; }
.s4-leg { grid-template-columns: 1fr 1fr; margin-top: 18px; font-size: 19px; }
</style>

<!--
⏱ 0:50 (ends 2:20) · Sources: RFC 9110 §3, §9.3.1

SAY: This is a complete HTTP/1.1 exchange. I'll go through it piece by piece, because QUERY changes exactly one of these pieces.

[click] One: the method, GET, which carries the intent.

[click] Two: the target, /products?category=laptop. The query parameter is part of the target, and therefore part of the URI.

[click] Three: headers. Host, the formats the client accepts, and credentials; here a bearer token.

[click] Four: the content, or body. A GET normally has none. RFC 9110 says content in a GET has no generally defined semantics, and some implementations reject it because of request-smuggling risk. So "just put a body on GET" is not a real option.

[click] Five: the response status line, 200 OK.

[click] Six: the response headers and content, the actual result.

[click] The complete exchange.

NOTICE: In GET, all the query input lives in the target URI; the body slot is empty. That is the problem this talk is about.

NEXT → Let's zoom in on the URI.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 4
---

# Anatomy of a URI

<div class="uri">
  <span class="seg sg1" :class="{ on: $clicks >= 1 }">https<span class="lab">scheme</span></span><span class="dl">://</span><span class="seg sg2" :class="{ on: $clicks >= 1 }">example.com:443<span class="lab">authority</span></span><span class="seg sg3" :class="{ on: $clicks >= 1 }">/search<span class="lab">path</span></span><span class="seg sg4" :class="{ on: $clicks >= 2 }">?q=security&amp;page=2<span class="lab">query</span></span><span class="seg sg5" :class="{ on: $clicks >= 3 }">#results<span class="lab">fragment</span></span>
</div>
<ul class="bul s5-defs">
  <li v-click="2"><b>query</b>: non-hierarchical data that, with the path, <b>identifies</b> a resource <Cite r="3986" s="3.4" /></li>
  <li v-click="3"><b>fragment</b>: handled by the user agent, <b>never sent</b> in the HTTP request <Cite r="3986" s="3.5" /></li>
</ul>
<div v-click="4" class="s5-neq">
  <div class="card cd-lav"><div class="s5-h">URI query component</div><div class="s5-code">?q=security&amp;page=2</div><div class="s5-t">Part of the resource <b>identifier</b> <Cite r="3986" s="3.4" /></div></div>
  <div class="s5-x">≠</div>
  <div class="card cd-orange"><div class="s5-h">HTTP QUERY method</div><div class="s5-code"><M t="QUERY" /> /search + content</div><div class="s5-t">A request <b>method</b>; the query input travels as request content <Cite r="10008" s="1.1" /></div></div>
</div>

<style>
.uri { font-family: var(--courier); font-size: 26px; font-weight: 700; text-align: center; margin: 12px 0 46px; white-space: nowrap; }
.seg { position: relative; padding: 1px 0 3px; border-bottom: 4px solid transparent; transition: all .4s ease; }
.lab { position: absolute; left: 50%; top: calc(100% + 6px); transform: translateX(-50%); font-family: var(--calibri); font-size: 19px; font-weight: 700; white-space: nowrap; opacity: 0; transition: opacity .4s ease; }
.seg.on .lab { opacity: 1; }
.sg1.on { border-color: var(--indigo); } .sg1 .lab { color: var(--indigo); }
.sg2.on { border-color: var(--teal); } .sg2 .lab { color: var(--teal); }
.sg3.on { border-color: #000; }
.sg4.on { border-color: var(--orange); background: var(--aqua); } .sg4 .lab { color: var(--orange); }
.sg5.on { border-color: var(--brown); } .sg5 .lab { color: var(--brown); }
.s5-defs > li { font-size: 21px; }
.s5-neq { display: grid; grid-template-columns: 1fr 60px 1fr; gap: 8px; margin-top: 18px; }
.s5-x { font-size: 54px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: var(--brown); }
.s5-h { font-size: 22px; font-weight: 700; color: var(--brown); }
.s5-code { font-family: var(--courier); font-size: 19px; font-weight: 700; margin: 6px 0; }
.s5-t { font-size: 19px; line-height: 1.25; }
</style>

<!--
⏱ 0:45 (ends 3:05) · Sources: RFC 3986 §3, §3.4, §3.5; RFC 10008 §1.1

SAY: A URI has five parts, defined in RFC 3986.

[click] The scheme, the authority (host and port), and the path.

[click] Then the query component, everything after the question mark. RFC 3986 is precise: the query is data that, together with the path, identifies a resource. It is part of the name of the thing.

[click] The fragment, after the hash, is handled by the browser and never sent to the server.

[click] The most important distinction in this talk: the URI query component and the HTTP QUERY method are different things that happen to share a word. The query component is part of an identifier. QUERY is a request method whose query input travels in the request content. RFC 10008 names them differently: "URI query parameters" versus "query content".

NOTICE: From now on, "QUERY" in capitals means the method.

NEXT → Why move the query out of the URI? Because URIs do not scale gracefully.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 5
---

# When the URI becomes the problem

<div class="s6-top">Query parameters suit small inputs: <b>filter · search · sort · paginate · select</b></div>
<div class="url" :class="{ bad: $clicks >= 4 }"><M t="GET" /> /search?q=laptop<span v-click="1">&amp;category=electronics&amp;brand=lenovo,dell,hp</span><span v-click="2">&amp;price_min=40000&amp;price_max=100000&amp;ram=16,32</span><span v-click="3">&amp;location=12.97,77.59&amp;radius=10km&amp;sort=price&amp;page=2</span><span v-click="4" class="hlq">&amp;filters=%7B%22gpu%22%3A%5B%22rtx-4060%22%2C%22rx-7600%22%5D%7D</span></div>
<div class="s6-bottom">
  <ul class="bul s6-facts">
    <li v-click="2"><b>No universal limit</b>: HTTP only recommends supporting ≥ 8000 octets <Cite r="9110" s="4.1" /></li>
    <li v-click="3"><b>Unknown real limits</b> across uncoordinated hops; servers may answer <span class="kbd">414 URI Too Long</span> <Cite r="10008" s="1" /> <Cite r="9110" s="15.5.15" /></li>
    <li v-click="4"><b>Encoding overhead</b>: structured or binary data must be percent-encoded <Cite r="9205" s="4.5.1" /></li>
    <li v-click="5"><b>More visible</b>: URIs are more likely than content to be logged or bookmarked <Cite r="10008" s="1" /></li>
  </ul>
  <div v-click="5">
    <div class="panel-title">→ as structured request content</div>
    <div class="msg s6-msg"><div class="ln">{ "q": "laptop",</div><div class="ln">  "brand": ["lenovo","dell","hp"],</div><div class="ln">  "price": {"min":40000,"max":100000},</div><div class="ln">  "gpu": ["rtx-4060","rx-7600"] }</div></div>
  </div>
</div>

<style>
.s6-top { font-size: 20px; }
.url { margin-top: 8px; min-height: 104px; font-family: var(--courier); font-size: 17px; font-weight: 700; line-height: 1.45; border: 1.5px solid var(--indigo); padding: 6px 10px; word-break: break-all; transition: border-color .4s; }
.url.bad { border: 2.5px solid var(--brown); }
.s6-bottom { display: grid; grid-template-columns: 1fr 410px; gap: 20px; margin-top: 10px; }
.s6-facts > li { font-size: 19px; margin-top: 4px; }
.s6-msg { font-size: 16px; }
</style>

<!--
⏱ 0:50 (ends 3:55) · Sources: RFC 9110 §4.1, §15.5.15; RFC 10008 §1; RFC 9205 §4.5.1

SAY: Query parameters are a good design for small inputs: filtering, search, sorting, pagination. The problem starts when the query grows.

[click] Add a category and a few brands. Still fine.

[click] Add price ranges and RAM. First fact people get wrong: HTTP does not define one maximum URL length. RFC 9110 only recommends supporting at least 8000 octets.

[click] Add location, radius, sort and page. RFC 10008 explains the real problem: the actual limits are unknown ahead of time, because the request crosses many uncoordinated systems. A server that won't accept it answers 414 URI Too Long.

[click] Now a structured JSON filter. It must be percent-encoded: a 30-character JSON object becomes 54 characters of this. RFC 9205 calls this out as a reason GET becomes unwieldy.

[click] And RFC 10008 notes URIs are more likely to be logged than content, and end up in bookmarks. The natural fix is structured request content, on the right.

CLARIFY: URLs don't "break" at a magic length; the honest statement is that the limits aren't known ahead of time.

NEXT → Logging is a security question, so let's follow this URI through a deployment.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 5
---

# Where can URI query data be recorded?

<div class="s7-req"><M t="GET" /> /users/search<span class="hlq">?email=alice@example.com&amp;role=admin</span> HTTP/1.1</div>
<div class="s7-flow">
  <div class="node"><carbon-application-web />Browser</div><div class="arrow">→</div>
  <div class="node"><carbon-content-delivery-network />CDN / proxy</div><div class="arrow">→</div>
  <div class="node"><carbon-firewall />WAF</div><div class="arrow">→</div>
  <div class="node"><carbon-server-proxy />Reverse proxy / server</div><div class="arrow">→</div>
  <div class="node"><carbon-application />Application</div><div class="arrow">→</div>
  <div class="node"><carbon-cloud-logging />Logs / SIEM</div>
</div>
<div class="s7-rec">
  <div v-click="1" class="rec">history · bookmarks</div><div></div>
  <div v-click="2" class="rec">edge access logs</div><div></div>
  <div v-click="2" class="rec">request logs, alerts</div><div></div>
  <div v-click="3" class="rec">access log (request line)</div><div></div>
  <div v-click="3" class="rec">app logs · APM · analytics</div><div></div>
  <div v-click="4" class="rec">indexed and retained</div>
</div>
<div v-click="5" class="s7-cmp">
  <div class="card cd-lav"><b>URI exposure surface</b><div>request line in access logs · history and bookmarks · <span class="kbd">Referer</span> (same-origin, or a relaxed Referrer-Policy) <Cite r="9110" s="17.9" /> <Cite t="W3C Referrer Policy" href="https://www.w3.org/TR/referrer-policy/" /></div></div>
  <div class="card"><b>Request-content exposure surface</b><div>body logging and debug capture · WAF / APM inspection · any TLS-terminating intermediary. Less likely to be logged, <i>not never</i> <Cite r="10008" s="4" /></div></div>
</div>

<style>
.s7-req { font-family: var(--courier); font-size: 18px; font-weight: 700; }
.s7-flow { display: grid; grid-template-columns: repeat(5, 1fr 22px) 1fr; margin-top: 12px; height: 76px; }
.s7-rec { display: grid; grid-template-columns: repeat(5, 1fr 22px) 1fr; margin-top: 6px; }
.rec { font-size: 16px; font-weight: 700; text-align: center; line-height: 1.15; color: var(--brown); border: 1.5px solid var(--brown); padding: 3px; }
.s7-cmp { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
.s7-cmp .card { font-size: 18px; line-height: 1.25; }
.s7-cmp b { font-size: 20px; display: block; margin-bottom: 3px; color: var(--brown); }
</style>

<!--
⏱ 1:00 (ends 4:55) · Sources: RFC 9110 §17.9; RFC 10008 §1, §4; W3C Referrer Policy

SAY: A realistic request: an admin searching users by email. The email address is in the query component. Let's follow it through a normal production path.

[click] It starts in the browser: history, possibly bookmarks.

[click] It passes a CDN or proxy and a WAF; both commonly log the request line.

[click] The reverse proxy and web server write it to their access log. Default access-log formats record the request line, which contains the URI. The application and APM or analytics tools may record it again.

[click] Finally it lands in a SIEM, indexed and retained. One email address, six places.

[click] The nuance: this does NOT mean "GET is insecure". RFC 9110 §17.9 says URIs are meant to be shared, not secured. Putting sensitive data in a URI multiplies where it can be recorded. The Referer header is weaker than it was: the W3C default policy now sends only the origin cross-origin, but same-origin requests, or relaxed policies, still send the full URL.

The right-hand box matters as much. Moving data into content reduces exposure but does not remove it: bodies can be logged, inspected, and seen by anything that terminates TLS. RFC 10008 says URIs are more likely to be logged. More likely, not always.

NEXT → So developers move the query out of the URI, and that opens a semantic gap.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 2
---

# Open issue: the semantic gap between GET and POST

<div class="s9">
  <div class="s9-grid">
    <div></div>
    <div class="s9-ch">Query input in the <b>URI</b></div>
    <div class="s9-ch">Query input in the <b>content</b></div>
    <div class="s9-rh">Safe + idempotent</div>
    <div class="s9-c card cd-lav"><M t="GET" /><div>Retrieval; the query is part of the identifier</div></div>
    <div class="s9-c card s9-gap" :class="{ filled: $clicks >= 1 }">
      <div v-if="$clicks < 1" class="s9-q">?<div>no standard method</div></div>
      <template v-else><M t="QUERY" /><div>Safe, idempotent query carried as content <Cite r="10008" s="2" /></div></template>
    </div>
    <div class="s9-rh">Unsafe / general processing</div>
    <div class="s9-c card"><span class="kbd">GET /page?do=delete</span><div>Anti-pattern: owner MUST disallow unsafe actions via safe methods <Cite r="9110" s="9.2.1" /></div></div>
    <div class="s9-c card cd-brown"><M t="POST" /><div>Resource-specific processing of the content <Cite r="9110" s="9.3.3" /></div></div>
  </div>
  <div class="s9-side">
    <div class="card s9-quote">Using POST for a query “hinders caching and uses an unsafe method for what would otherwise be a safe request.” <Cite r="9110" s="17.9" /></div>
    <div v-click="2" class="card cd-orange s9-msg">QUERY is <b>not a replacement</b> for GET or POST. It fills the gap between them.</div>
  </div>
</div>

<style>
.s9 { display: grid; grid-template-columns: 1fr 260px; gap: 20px; }
.s9-grid { display: grid; grid-template-columns: 110px 1fr 1fr; grid-template-rows: auto 1fr 1fr; gap: 10px; }
.s9-ch { font-size: 19px; text-align: center; align-self: end; }
.s9-rh { font-size: 19px; font-weight: 700; color: var(--brown); align-self: center; line-height: 1.2; }
.s9-c { font-size: 19px; line-height: 1.25; min-height: 138px; display: flex; flex-direction: column; gap: 8px; justify-content: center; }
.s9-c .mpill { align-self: flex-start; font-size: 20px; }
.s9-gap { border: 2px dashed var(--orange); }
.s9-gap.filled { border-style: solid; background: #fff; }
.s9-q { font-size: 46px; font-weight: 700; color: var(--orange); text-align: center; line-height: 1; }
.s9-q div { font-size: 18px; margin-top: 6px; }
.s9-side { display: flex; flex-direction: column; gap: 14px; }
.s9-quote { font-size: 19px; font-style: italic; line-height: 1.3; }
.s9-msg { font-size: 21px; line-height: 1.3; }
</style>

<!--
⏱ 0:45 (ends 5:40) · Sources: RFC 9110 §9.2.1, §9.3.3, §17.9; RFC 10008 §2

SAY: This is the open issue the Introduction leads to. The columns ask where the query input lives: URI or content. The rows ask what the method promises: safe and idempotent, or general processing.

GET is top-left and POST bottom-right. Bottom-left is an anti-pattern: an action like "delete" behind a safe method, which RFC 9110 says the owner MUST disallow. Top-right was empty: there was no standard way to say "this is a safe, idempotent query, with the input in the body". RFC 9110 itself admits this in §17.9, quoted on the right.

[click] QUERY fills exactly that cell.

[click] So QUERY is not a replacement for GET or POST. If your query fits in a URL, use GET. If you're changing state, use POST.

NEXT → That gives me the objectives of this study.
-->

---
section: 2. Objectives
frame: obj
---

<ul class="bul obj">
  <li>Explain why HTTP distinguishes safe, idempotent and general-purpose methods</li>
  <li>Examine how query input in the URI creates size and exposure problems</li>
  <li>Analyse the HTTP QUERY method as standardised in RFC 10008</li>
  <li>Compare GET, POST and QUERY: semantics, caching, discovery and deployment</li>
  <li>Identify security implications for browsers, caches, WAFs, gateways and applications</li>
  <li>Survey the standards and peer-reviewed literature on the underlying mechanisms</li>
  <li>Recommend when to use GET, QUERY or POST</li>
</ul>

<style>
.obj { margin-top: 18px; }
.obj > li { font-size: 24px; margin-top: 16px; }
</style>

<!--
⏱ 0:30 (ends 6:10)

SAY: My objectives follow from that gap. First, the fundamentals: why methods and their properties matter, and why URI-based queries break down. Then the core: what RFC 10008 actually specifies, and how QUERY compares with GET and POST. The security objective is the main one: what changes for browsers, caches, WAFs, gateways and applications. Finally, I survey the literature and end with a recommendation on when to use each method.

NEXT → The literature review, starting with the standards.
-->

---
section: 3. Literature Review
frame: lit
---

<table class="tbl lit">
  <colgroup><col style="width: 23.2%"><col style="width: 21.9%"><col style="width: 26.9%"><col style="width: 28%"></colgroup>
  <thead><tr><th>Authors and Title</th><th>Dataset</th><th>Purpose of Study</th><th>Key Findings</th></tr></thead>
  <tbody>
    <tr><td>J. Reschke, J. M. Snell, M. Bishop, “<a href="https://www.rfc-editor.org/rfc/rfc10008.html">The HTTP QUERY Method</a>,” RFC 10008, 2026</td><td>IETF Standards Track specification</td><td>Define a safe, idempotent method whose query is carried in the request content</td><td>Content-Type required; cacheable with content in the cache key; Accept-Query; Location / Content-Location; CORS preflight required</td></tr>
    <tr><td>R. Fielding, M. Nottingham, J. Reschke (Eds.), “<a href="https://www.rfc-editor.org/rfc/rfc9110.html">HTTP Semantics</a>,” RFC 9110, 2022</td><td>IETF Internet Standard (STD 97)</td><td>Define HTTP method semantics, safety and idempotency</td><td>Safe and idempotent describe client intent; URIs are not secured; POST for safe queries “uses an unsafe method” (§17.9)</td></tr>
    <tr><td>M. Nottingham, “<a href="https://www.rfc-editor.org/rfc/rfc9205.html">Building Protocols with HTTP</a>,” RFC 9205 (BCP 56), 2022</td><td>IETF Best Current Practice</td><td>Guide the design of HTTP-based APIs</td><td>GET queries can be unwieldy (URI syntax, encoding); POST queries lose caching and linking</td></tr>
    <tr><td>A. Backman, J. Richer, M. Sporny (Eds.), “<a href="https://www.rfc-editor.org/rfc/rfc9421.html">HTTP Message Signatures</a>,” RFC 9421, 2024</td><td>IETF Standards Track specification</td><td>Sign HTTP message components for integrity and authenticity</td><td>@query covers only the URI query; content needs Content-Digest (RFC 9530); query / form parameter shadowing</td></tr>
  </tbody>
</table>

<!--
⏱ 0:45 (ends 6:55) · Sources: RFC 10008; RFC 9110; RFC 9205; RFC 9421

SAY: The primary sources are standards. RFC 10008 defines QUERY: Content-Type is mandatory, responses are cacheable but the cache key must include the content, there is a new Accept-Query header, the server can mint URIs for later GETs, and browsers need a CORS preflight. RFC 9110 defines the semantics I've been using: safe and idempotent describe client intent, URIs are not secured, and POST for queries is an admitted compromise. RFC 9205 is the IETF's best-practice guide; it says GET queries can become unwieldy, and POST queries lose caching and linking. RFC 9421 matters for security: signing the URI query protects nothing when the query is in the body.

CLARIFY: The "Dataset" column is the template's; for a standard it describes what kind of document it is.

NEXT → The peer-reviewed studies.
-->

---
section: 3. Literature Review
frame: lit
---

<table class="tbl lit">
  <colgroup><col style="width: 23.2%"><col style="width: 21.9%"><col style="width: 26.9%"><col style="width: 28%"></colgroup>
  <thead><tr><th>Authors and Title</th><th>Dataset</th><th>Purpose of Study</th><th>Key Findings</th></tr></thead>
  <tbody>
    <tr><td>O. Starov, P. Gill, N. Nikiforakis, “<a href="https://doi.org/10.1515/popets-2015-0028">Are You Sure You Want to Contact Us? Quantifying the Leakage of PII via Website Contact Forms</a>,” PoPETs, 2016</td><td>Contact pages of the 100,000 most popular websites</td><td>Measure leakage of personally identifiable information submitted via contact forms</td><td>PII leaked to third parties via third-party submissions, third-party scripts and the Referer header</td></tr>
    <tr><td>H. V. Nguyen, L. Lo Iacono, H. Federrath, “<a href="https://doi.org/10.1145/3319535.3354215">Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack</a>,” ACM CCS, 2019</td><td>15 web caching solutions (proxy caches and CDNs)</td><td>Study attacks where an origin error is cached and served to other users</td><td>Introduced CPDoS; 1 proxy cache and 5 CDN services vulnerable; one request can disable a site for a region</td></tr>
    <tr><td>S. A. Mirheidari et al., “<a href="https://www.usenix.org/conference/usenixsecurity20/presentation/mirheidari">Cached and Confused: Web Cache Deception in the Wild</a>,” USENIX Security, 2020</td><td>340 high-profile sites from the Alexa Top 5K</td><td>Quantify web cache deception and path-confusion variants</td><td>Private data and auth tokens leaked via caches; many sites still vulnerable two years after disclosure</td></tr>
  </tbody>
</table>
<div class="lit-note">No peer-reviewed study of RFC 10008 itself was found (Crossref and web search, Sept 2026); these studies cover the mechanisms QUERY relies on.</div>

<style>
.slidev-layout .tbl.lit { font-size: 16px; line-height: 1.22; }
.slidev-layout .tbl.lit td { padding: 6px 7px; }
.lit-note { margin: 8px 7px 0; font-size: 15px; font-style: italic; color: var(--brown); }
</style>

<!--
⏱ 0:45 (ends 7:40) · Sources: Starov et al. 2016; Nguyen et al. 2019; Mirheidari et al. 2020

SAY: I searched Crossref and the web for peer-reviewed work on RFC 10008 itself and found none, which is expected for a standard published in June 2026. So these are studies of the mechanisms QUERY depends on.

Starov and colleagues, PoPETs 2016, measured the top 100,000 sites and found contact-form PII leaking to third parties, including through the Referer header. That's the URI-exposure problem measured in the wild; note it predates today's stricter default referrer policy.

Nguyen and colleagues, CCS 2019, introduced cache-poisoned denial of service. Of 15 caching systems, one proxy cache and five CDNs could be made to cache an error page. When cache and origin disagree, attackers exploit it.

Mirheidari and colleagues, USENIX Security 2020, found web cache deception on high-profile sites, leaking private data and tokens. That's the same class of risk as QUERY's cache-key normalisation problem.

NEXT → Three more studies.
-->

---
section: 3. Literature Review
frame: lit
---

<table class="tbl lit">
  <colgroup><col style="width: 23.2%"><col style="width: 21.9%"><col style="width: 26.9%"><col style="width: 28%"></colgroup>
  <thead><tr><th>Authors and Title</th><th>Dataset</th><th>Purpose of Study</th><th>Key Findings</th></tr></thead>
  <tbody>
    <tr><td>B. Jabiyev, S. Sprecher, K. Onarlioglu, E. Kirda, “<a href="https://doi.org/10.1145/3460120.3485384">T-Reqs: HTTP Request Smuggling with Differential Fuzzing</a>,” ACM CCS, 2021</td><td>10 popular server, proxy and CDN technologies, tested in pairs</td><td>Systematically find HTTP processing discrepancies that enable request smuggling</td><td>Grammar-based differential fuzzing found new request manipulations and server pairs prone to smuggling</td></tr>
    <tr><td>J. Chen et al., “<a href="https://www.usenix.org/conference/usenixsecurity18/presentation/chen-jianjun">We Still Don’t Have Secure Cross-Domain Requests: an Empirical Study of CORS</a>,” USENIX Security, 2018</td><td>Real-world uses of CORS: design, implementation, deployment</td><td>Assess the security of CORS in practice</td><td>CORS relaxes cross-origin “write” in subtle ways, adds risky trust dependencies and is often misconfigured</td></tr>
    <tr><td>A. Cha et al., “<a href="https://doi.org/10.1145/3368089.3409670">A Principled Approach to GraphQL Query Cost Analysis</a>,” ESEC/FSE, 2020</td><td>Query-response corpus for two commercial GraphQL APIs</td><td>Estimate query cost before execution</td><td>Linear-time static analysis gives tight upper bounds; existing analyses over- or under-estimate</td></tr>
    <tr><td>O. Hartig, J. Pérez, “<a href="https://doi.org/10.1145/3178876.3186014">Semantics and Complexity of GraphQL</a>,” WWW, 2018</td><td>Formal model; experiments on practical implementations</td><td>Formalise GraphQL and analyse its complexity</td><td>Evaluation is NL-complete, yet responses can be prohibitively large; size is computable in polynomial time</td></tr>
  </tbody>
</table>

<!--
⏱ 0:45 (ends 8:25) · Sources: Jabiyev et al. 2021; Chen et al. 2018; Cha et al. 2020; Hartig & Pérez 2018

SAY: Jabiyev and colleagues, CCS 2021, used differential fuzzing on ten popular servers, proxies and CDNs and found request-smuggling discrepancies. A new method with a body is a new input for exactly these bugs.

Chen and colleagues, USENIX Security 2018, studied CORS in practice and found widespread misconfiguration. QUERY always needs a cross-origin preflight, so CORS configuration is on the critical path.

The last two are about cost. Cha and colleagues, FSE 2020, bound the cost of a GraphQL query before running it, and Hartig and Pérez, WWW 2018, proved GraphQL responses can be very large. Both matter when the request content is itself a query language, which is exactly what QUERY carries.

NEXT → With that background, the Description: what QUERY is.
-->

---
section: 4. Description
frame: desc
clicks: 5
---

# Moving the query out of the URI: GET → POST → QUERY

<QueryMorph :step="$clicks" />

<!--
⏱ 0:55 (ends 9:20) · Sources: RFC 9110 §9.2, §9.3.3, §17.9; RFC 10008 §1, §2

SAY: The same query in three forms. Start with GET: the query data, highlighted, sits in the URI. The strip below shows GET is safe and idempotent, but not body-oriented.

[click] The usual workaround is POST. Watch the query data move out of the URI into the request content as JSON. No URI size problem, natural structure, nothing in the request line. But POST is not safe and not idempotent by definition, so nothing tells a cache, proxy or retrying client this is a harmless read. RFC 9110 §17.9 says this workaround "uses an unsafe method for what would otherwise be a safe request."

[click] QUERY keeps exactly the same content and changes only the method.

[click] Because RFC 10008 defines it as safe,

[click] and idempotent,

[click] while the query stays in the content.

CLARIFY: The data didn't change between POST and QUERY, only what the method promises. Semantics are a contract with every intermediary.

NEXT → What RFC 10008 actually specifies.
-->

---
section: 4. Description
frame: desc
clicks: 7
---

# Anatomy of a QUERY exchange (RFC 10008)

<div class="s10">
  <div>
    <div class="panel-title">Request</div>
    <div class="msg">
      <div class="ln"><span class="part" :class="{ now: $clicks === 1, on: $clicks > 1 }">QUERY</span><span class="num">1</span> <span class="part" :class="{ now: $clicks === 2, on: $clicks > 2 }">/feed</span><span class="num">2</span> <span class="h">HTTP/1.1</span></div>
      <div class="ln h">Host: example.org</div>
      <div class="ln"><span class="part" :class="{ now: $clicks === 3, on: $clicks > 3 }">Content-Type: application/json</span><span class="num">3</span></div>
      <div class="ln h">Accept: application/json</div>
      <div class="ln"> </div>
      <div class="part" :class="{ now: $clicks === 4, on: $clicks > 4 }"><div class="ln">{ "q": "cybersecurity",<span class="num">4</span></div><div class="ln">  "limit": 20, "sort": "relevance",</div><div class="ln">  "filters": { "year": 2026 } }</div></div>
    </div>
  </div>
  <div>
    <div class="panel-title">Response</div>
    <div class="msg">
      <div class="ln">HTTP/1.1 200 OK</div>
      <div class="ln h">Content-Type: application/json</div>
      <div class="ln"><span class="part" :class="{ now: $clicks === 5, on: $clicks > 5 }">Accept-Query: application/json</span><span class="num">5</span></div>
      <div class="ln"><span class="part" :class="{ now: $clicks === 6, on: $clicks > 6 }">Location: /queries/42</span><span class="num">6</span></div>
      <div class="ln"><span class="part" :class="{ now: $clicks === 6, on: $clicks > 6 }">Content-Location: /results/17</span><span class="num">7</span></div>
      <div class="ln"> </div>
      <div class="ln h">[ …results… ]</div>
    </div>
  </div>
</div>
<div class="legend s10-leg">
  <div v-click="1"><span class="num">1</span><b>QUERY</b>: safe + idempotent <Cite t="IANA registry" href="https://www.iana.org/assignments/http-methods/" /></div>
  <div v-click="5"><span class="num">5</span><b>Accept-Query</b>: query formats accepted <Cite r="10008" s="3" /></div>
  <div v-click="2"><span class="num">2</span><b>Target</b>: the resource that scopes the query</div>
  <div v-click="6"><span class="num">6</span><b>Location</b>: GET here repeats the query <Cite r="10008" s="2.4" /></div>
  <div v-click="3"><span class="num">3</span><b>Content-Type</b>: REQUIRED, never sniffed <Cite r="10008" s="2.1" /></div>
  <div v-click="6"><span class="num">7</span><b>Content-Location</b>: GET here fetches this result <Cite r="10008" s="2.3" /></div>
  <div v-click="4"><span class="num">4</span><b>Content</b>: the query itself (“query content”)</div>
</div>

<style>
.s10 { display: grid; grid-template-columns: 450px 1fr; gap: 22px; }
.s10 .msg { font-size: 16px; line-height: 1.42; }
.s10-leg { grid-template-columns: 1fr 1fr; margin-top: 12px; font-size: 18px; }
</style>

<!--
⏱ 1:00 (ends 10:20) · Sources: RFC 10008 §2, §2.1–2.5, §3, §5.1; IANA HTTP Method Registry

SAY: A QUERY exchange in the style of the RFC's own examples.

[click] One: the method, registered with IANA as safe and idempotent, on the same list as GET.

[click] Two: the target, /feed. The target resource determines the scope of the query.

[click] Three: Content-Type. The server MUST fail the request if Content-Type is missing or inconsistent with the content, and may not sniff the type. The RFC suggests 400 for missing or inconsistent, 415 for an unsupported format, and 422 for a well-formed query that can't be processed.

[click] Four: the content is the query itself, "query content". Here JSON; it could be SQL, JSONPath or form encoding.

[click] On the response, five: the new Accept-Query header, a Structured Field list of the query formats this resource accepts.

[click] Six and seven: the server can mint URIs for later GETs. Location repeats this query; Content-Location returns this particular result. If the query contains sensitive data, those URIs SHOULD NOT include it (§4); otherwise the data goes straight back into a URI.

[click] The full exchange. Also: 301, 302, 307 and 308 redirects keep the QUERY method, unlike the old POST-to-GET exception, while 303 tells the client to switch to GET.

NEXT → GET, POST and QUERY side by side.
-->

---
section: 4. Description
frame: desc
clicks: 1
---

# GET vs POST vs QUERY

<table class="tbl s11">
  <thead><tr><th>Property</th><th><M t="GET" /></th><th><M t="POST" /></th><th v-click="1"><M t="QUERY" /></th></tr></thead>
  <tbody>
    <tr><td>Query input carried in</td><td>URI query component</td><td>Request content</td><td v-click="1">Request content</td></tr>
    <tr><td>Safe</td><td><span class="ok">✓</span> Yes</td><td><span class="bad">✗</span> Not by definition</td><td v-click="1"><span class="ok">✓</span> Yes</td></tr>
    <tr><td>Idempotent</td><td><span class="ok">✓</span> Yes</td><td><span class="bad">✗</span> Not by definition</td><td v-click="1"><span class="ok">✓</span> Yes</td></tr>
    <tr><td>Large, structured input</td><td>Awkward: URI limits, encoding</td><td><span class="ok">✓</span> Yes</td><td v-click="1"><span class="ok">✓</span> Yes</td></tr>
    <tr><td>Caching</td><td>Mature; key = method + URI</td><td>Rarely implemented</td><td v-click="1">Allowed; key MUST include content</td></tr>
    <tr><td>URI for the query</td><td>Yes, by definition</td><td>No</td><td v-click="1">Optional (Location)</td></tr>
    <tr><td>Ecosystem support</td><td>Mature</td><td>Mature</td><td v-click="1">Emerging (2026)</td></tr>
    <tr><td>Primary purpose</td><td>Retrieval</td><td>General processing</td><td v-click="1">Safe query with content</td></tr>
  </tbody>
</table>
<div class="s11-src">Sources: <Cite r="10008" s="1" /> Table 1 · <Cite r="9110" s="9.2" /> · <Cite r="9110" s="9.2.3" /> · <Cite r="9111" s="2" /></div>

<style>
.s11 { font-size: 18px; }
.s11 th:nth-child(1) { width: 25%; }
.s11 th .mpill { font-size: 19px; }
.s11 td:first-child { font-weight: 700; }
.s11 td { padding: 5px 8px; }
.s11-src { margin-top: 6px; font-size: 15px; }
</style>

<!--
⏱ 0:45 (ends 11:05) · Sources: RFC 10008 §1 (Table 1); RFC 9110 §9.2, §9.2.3; RFC 9111 §2

SAY: This follows Table 1 of RFC 10008 plus deployment rows. GET puts the input in the URI, is safe and idempotent, and has mature caching keyed on method plus URI. POST carries the input in content but makes no safety promise; HTTP does define POST caching, but RFC 9110 notes most caches only support GET and HEAD.

[click] QUERY: body-based like POST, safe and idempotent like GET. Responses are cacheable, but the cache key MUST include the content, so a cache must read the whole body first. A URI for the query is optional, via Location. Ecosystem support is emerging.

CLARIFY: "Not by definition" rather than "never" for POST: a particular POST endpoint may behave safely, but the method guarantees nothing, which is the problem.

NEXT → What "safe" means for security.
-->

---
section: 4. Description
frame: desc
---

# Safe ≠ secure · Idempotent ≠ harmless

<div class="s12">
  <div class="s12-l">
    <div class="card cd-lav"><b>Safe</b><div>“the client does not request, and does not expect, any state change” <Cite r="9110" s="9.2.1" /></div></div>
    <div class="card cd-lav"><b>Idempotent</b><div>several identical requests have the same <i>intended</i> effect as one <Cite r="9110" s="9.2.2" /></div></div>
    <div class="card cd-orange"><b>Both describe the client’s intent</b><div>RFC 9110: safety “does not prevent an implementation from including behavior that is potentially harmful”.</div></div>
  </div>
  <div>
    <div class="s12-h">A safe, idempotent QUERY can still enable:</div>
    <ul class="bul s12-l2">
      <v-clicks>
      <li><b>Resource exhaustion</b>: huge, nested, high-cardinality queries <Cite t="Cha et al., 2020" href="https://doi.org/10.1145/3368089.3409670" /></li>
      <li><b>Information disclosure</b>: results the caller should never see</li>
      <li><b>Broken authorization</b>: read-only is not the same as allowed</li>
      <li><b>Injection</b>: query content is untrusted input (SQL, NoSQL, LDAP, search DSLs)</li>
      <li><b>Automated repetition</b>: retries are expected, and so is scraping</li>
      </v-clicks>
    </ul>
  </div>
</div>

<style>
.s12 { display: grid; grid-template-columns: 390px 1fr; gap: 26px; }
.s12-l { display: flex; flex-direction: column; gap: 12px; }
.s12-l .card { font-size: 19px; line-height: 1.25; }
.s12-l b { font-size: 21px; display: block; color: var(--brown); }
.s12-h { font-size: 22px; font-weight: 700; color: var(--brown); }
.s12-l2 > li { font-size: 21px; margin-top: 12px; }
</style>

<!--
⏱ 0:45 (ends 11:50) · Sources: RFC 9110 §9.2.1, §9.2.2; Cha et al. 2020

SAY: The most important security distinction in the talk: safe does not mean secure, and idempotent does not mean harmless. Both describe what the client intends, not how the server is protected. RFC 9110 says so directly.

[click] Resource exhaustion: query content can be deeply nested or high-cardinality; the GraphQL literature shows a short query can be very expensive.

[click] Information disclosure: a safe request can return data the caller should never see.

[click] Broken authorisation: an admin-role user search is read-only, and still sensitive.

[click] Injection: query content is untrusted input wherever it ends up. Moving it from URI to body changes nothing.

[click] Automated repetition: idempotent requests are designed to be retried, so rate limits still matter.

NEXT → Cacheability brings its own risk.
-->

---
section: 4. Description
frame: desc
clicks: 3
---

# Caching QUERY: the key must include the content

<div class="s13-rules">
  <div class="card cd-orange"><b>RFC 10008:</b> the cache key MUST incorporate the request content and related metadata <Cite r="10008" s="2.7" /></div>
  <div class="card cd-lav"><b>Reality:</b> many caches only cache GET, so they key on the URI alone <Cite r="9111" s="2" /></div>
</div>
<div class="s13-row" v-click="1">
  <div class="s13-req"><M t="QUERY" /> /users/search<div class="kbd">{"role":"admin"}</div></div><div class="arrow">→</div>
  <div class="s13-key">method + URI + content → <b>K₁</b></div><div class="arrow">→</div>
  <div class="s13-res card cd-lav">Response A (admins)</div>
</div>
<div class="s13-row" v-click="1">
  <div class="s13-req"><M t="QUERY" /> /users/search<div class="kbd">{"role":"user"}</div></div><div class="arrow">→</div>
  <div class="s13-key">method + URI + content → <b>K₂</b></div><div class="arrow">→</div>
  <div class="s13-res card cd-teal">Response B (users)</div>
</div>
<div class="s13-row s13-badrow" v-click="2">
  <div class="s13-req"><M t="QUERY" /> /users/search<div class="kbd">{"role":"user"}</div></div><div class="arrow">→</div>
  <div class="s13-key s13-badkey">content ignored, or <b>role</b> normalized away → <b>K₁</b></div><div class="arrow">→</div>
  <div class="s13-res card cd-brown">✗ Response A served</div>
</div>
<div v-click="3" class="s13-foot">Normalization MAY drop insignificant differences (e.g. content encoding); a false positive returns the wrong response <Cite r="10008" s="4" />. Cache ↔ origin disagreement drives cache poisoning and deception <Cite t="Nguyen et al., 2019" href="https://doi.org/10.1145/3319535.3354215" /> <Cite t="Mirheidari et al., 2020" href="https://www.usenix.org/conference/usenixsecurity20/presentation/mirheidari" /></div>

<style>
.s13-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.s13-rules .card { font-size: 19px; line-height: 1.25; }
.s13-rules b { color: var(--brown); }
.s13-row { display: grid; grid-template-columns: 250px 34px 1fr 34px 240px; align-items: center; margin-top: 10px; }
.s13-req { font-family: var(--courier); font-size: 17px; font-weight: 700; line-height: 1.35; }
.s13-req .kbd { display: inline-block; font-size: 16px; margin-top: 3px; }
.s13-key { font-family: var(--courier); font-size: 16px; font-weight: 700; border: 1.5px solid #000; padding: 7px 8px; text-align: center; line-height: 1.25; }
.s13-badkey { border: 2px solid var(--brown); color: var(--brown); }
.s13-res { font-size: 19px; font-weight: 700; text-align: center; padding: 8px; }
.s13-badrow { padding-top: 10px; border-top: 2px dashed var(--brown); }
.s13-foot { margin-top: 10px; font-size: 18px; line-height: 1.25; }
</style>

<!--
⏱ 0:50 (ends 12:40) · Sources: RFC 10008 §2.7, §4; RFC 9111 §2; Nguyen et al. 2019; Mirheidari et al. 2020

SAY: QUERY responses are cacheable, which is a selling point and also the biggest new attack surface. RFC 10008 says the cache key MUST include the request content and related metadata such as Content-Type. But RFC 9111 notes many caches only cache GET, and so key on the URI alone.

[click] Done correctly, two QUERY requests to the same URI with different content get different keys, K1 and K2, and different responses.

[click] The failure case: the cache ignores the content, or normalises too aggressively and drops "role". The second request maps to K1 and the admin response is served to the wrong query: a data leak or cache poisoning, depending on who warmed the cache.

[click] The RFC allows normalisation, like removing content encoding, to improve hit rates, and warns that normalisation which disagrees with the origin returns incorrect responses. The cache-poisoning and cache-deception papers show this disagreement is exploitable.

CLARIFY: I'm not claiming a specific CDN behaves this way; QUERY caching is harder than GET caching, and new code paths are where bugs live.

NEXT → Browsers, and CORS.
-->

---
section: 4. Description
frame: desc
clicks: 3
---

# QUERY from the browser: CORS preflight

<div class="s14">
  <div class="seq">
    <div class="seq-head"><span>Browser</span><span>Server</span></div>
    <div class="seq-lines"><i></i><i></i></div>
    <div class="seq-m r"><div class="seq-t">① OPTIONS /search</div><div class="seq-l">Access-Control-Request-Method: QUERY</div><div class="seq-s">+ Origin, Access-Control-Request-Headers</div><div class="seq-a"></div></div>
    <div class="seq-m l" v-click="1"><div class="seq-t">② 204 No Content</div><div class="seq-l">Access-Control-Allow-Methods: QUERY</div><div class="seq-s">+ Allow-Origin, Allow-Headers, Max-Age</div><div class="seq-a"></div></div>
    <div class="seq-m r q" v-click="2"><div class="seq-t">③ QUERY /search</div><div class="seq-l">{ "q": "security" }</div><div class="seq-a"></div></div>
    <div class="seq-m l" v-click="2"><div class="seq-t">④ 200 OK</div><div class="seq-l">results, shown only if origin allowed</div><div class="seq-a"></div></div>
  </div>
  <div class="s14-side">
    <div class="s14-h">Is a preflight needed?</div>
    <ul class="bul s14-l">
      <li><b class="ok">Yes</b>: cross-origin <span class="kbd">fetch()</span>; only GET, HEAD, POST are CORS-safelisted <Cite t="Fetch" href="https://fetch.spec.whatwg.org/#methods" /> <Cite r="10008" s="4" /></li>
      <li><b class="bad">No</b>: same-origin requests</li>
      <li><b class="bad">No</b>: non-browser clients (curl, service-to-service)</li>
    </ul>
    <div v-click="3" class="card cd-brown s14-w">Forms send only GET / POST and <span class="kbd">no-cors</span> rejects QUERY, so a cross-site page cannot send it <b>without server opt-in</b>. A permissive CORS policy can still leak results. <Cite t="HTML" href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method" /> <Cite t="Chen et al., 2018" href="https://www.usenix.org/conference/usenixsecurity18/presentation/chen-jianjun" /></div>
  </div>
</div>

<style>
.s14 { display: grid; grid-template-columns: 540px 1fr; gap: 22px; }
.seq { position: relative; }
.seq-head { display: flex; justify-content: space-between; }
.seq-head span { width: 108px; text-align: center; font-size: 19px; font-weight: 700; border: 1.5px solid var(--indigo); background: var(--lav); padding: 3px 0; }
.seq-lines { position: absolute; top: 34px; bottom: 0; left: 0; right: 0; }
.seq-lines i { position: absolute; top: 0; bottom: 0; width: 2px; background: #000; }
.seq-lines i:first-child { left: 53px; } .seq-lines i:last-child { right: 53px; }
.seq-m { position: relative; margin: 10px 54px 0 54px; padding-bottom: 7px; }
.seq-t { font-family: var(--courier); font-size: 17px; font-weight: 700; padding: 0 10px; line-height: 1.3; }
.seq-l { font-family: var(--courier); font-size: 15px; font-weight: 700; padding: 0 10px; line-height: 1.3; }
.seq-s { font-family: var(--courier); font-size: 14px; padding: 0 10px; }
.seq-a { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: #000; }
.seq-m.r .seq-a::after, .seq-m.l .seq-a::after { content: ''; position: absolute; top: -6px; border: 7px solid transparent; }
.seq-m.r .seq-a::after { right: -2px; border-left: 11px solid #000; border-right: 0; }
.seq-m.l .seq-a::after { left: -2px; border-right: 11px solid #000; border-left: 0; }
.seq-m.l .seq-t, .seq-m.l .seq-l, .seq-m.l .seq-s { text-align: right; }
.seq-m.q .seq-a { background: var(--orange); height: 3px; }
.s14-h { font-size: 22px; font-weight: 700; color: var(--brown); }
.s14-l > li { font-size: 19px; margin-top: 6px; }
.s14-w { font-size: 17px; line-height: 1.25; margin-top: 10px; }
</style>

<!--
⏱ 0:45 (ends 13:25) · Sources: WHATWG Fetch §2.2.1, CORS protocol; RFC 10008 §4; WHATWG HTML (form method); Chen et al. 2018

SAY: Browsers add a layer. When JavaScript on one origin sends QUERY to another, the browser first sends a preflight: an OPTIONS request asking whether the server accepts QUERY from this origin. It's needed because Fetch lists only GET, HEAD and POST as CORS-safelisted methods, and RFC 10008's security considerations say the same.

[click] The server must answer Access-Control-Allow-Methods: QUERY; the browser can cache this for Max-Age.

[click] Only then is the real QUERY sent, and the response exposed only if the origin is allowed.

Be precise: same-origin requests don't involve CORS, and curl or service-to-service calls aren't browsers.

[click] Security consequence: forms only submit GET or POST, and fetch's no-cors mode rejects non-safelisted methods, so a malicious page cannot fire QUERY at your API without your server agreeing in a preflight. That's stronger than POST. But Chen et al. showed CORS is often misconfigured; a permissive, credentialed policy could still leak QUERY results.

NEXT → For service-to-service integrity: HTTP Message Signatures.
-->

---
section: 4. Description
frame: desc
---

# QUERY and HTTP Message Signatures (RFC 9421)

<div class="s15">
  <table class="tbl s15-t">
    <thead><tr><th>Signed component</th><th>What it covers</th><th>In a QUERY request</th></tr></thead>
    <tbody>
      <tr><td class="mono">@method</td><td>request method</td><td><span class="ok">✓</span> QUERY</td></tr>
      <tr><td class="mono">@target-uri</td><td>full target URI</td><td><span class="ok">✓</span> …/search</td></tr>
      <tr><td class="mono">@query</td><td>URI query component</td><td><span class="bad">✗</span> usually just <span class="kbd">?</span></td></tr>
      <tr><td class="mono">@query-param</td><td>one URI query parameter</td><td><span class="bad">✗</span> nothing in the content</td></tr>
      <tr><td class="mono">content-digest</td><td>hash of the content <Cite r="9530" /></td><td><span class="ok">✓</span> the query itself</td></tr>
    </tbody>
  </table>
  <ul class="bul s15-l">
    <v-clicks>
    <li><b>Sign the content</b>: cover <span class="kbd">content-digest</span>; the verifier must recompute it <Cite r="9421" s="7.2.8" /></li>
    <li><b>Parameter shadowing</b>: frameworks that merge URI and form parameters let an unsigned body value override a signed one <Cite r="9421" s="7.5.8" /></li>
    <li><b>Re-encoding</b> intermediaries change the digest and must re-sign <Cite r="9421" s="7.2.8" /></li>
    <li><b>Integrity and origin only</b>: not authorization, validation or confidentiality <Cite r="9421" s="1" /></li>
    </v-clicks>
  </ul>
</div>

<style>
.s15 { display: grid; grid-template-columns: 500px 1fr; gap: 22px; }
.s15-t td { font-size: 17px; padding: 8px 7px; }
.s15-t td.mono { font-weight: 700; white-space: nowrap; }
.s15-t th { font-size: 17px; }
.s15-l > li { font-size: 19px; margin-top: 10px; }
.s15-l > li:first-child { margin-top: 0; }
</style>

<!--
⏱ 0:45 (ends 14:10) · Sources: RFC 9421 §1, §2.2.7, §2.2.8, §7.2.8, §7.5.8; RFC 9530

SAY: RFC 9421 lets a sender sign selected parts of a request so another service can detect tampering. It defines derived components such as @method, @target-uri, @query and @query-param.

Look at the @query rows. For GET, signing @query protects the search terms. For QUERY, the terms are no longer in the URI, so @query is usually a bare question mark and @query-param covers nothing. Port a GET signing policy to QUERY unchanged, and the signature protects everything except the query.

[click] RFC 9421 does not sign content directly: add a Content-Digest header from RFC 9530 and sign that, and the verifier must recompute the digest over the content it received.

[click] Section 7.5.8 describes parameter shadowing: frameworks merge URI and form-encoded body parameters, and QUERY content can be form-encoded.

[click] Intermediaries that change content encoding change the digest, so they must re-sign.

[click] And signatures give integrity and origin authentication only; not authorisation, validation or confidentiality.

NEXT → All the layers in one threat model.
-->

---
section: 4. Description
frame: desc
clicks: 6
---

# Threat model along the request path

<div class="s16">
  <div class="s16-r"><div class="node s16-n"><carbon-application-web />Browser / client</div><div class="s16-c" v-click="1">CORS preflight and allowed origins · credentials mode · exact method casing</div></div>
  <div class="s16-r"><div class="node s16-n"><carbon-content-delivery-network />CDN / cache</div><div class="s16-c" v-click="2">cache key includes content + type · safe normalization · poisoning, deception</div></div>
  <div class="s16-r"><div class="node s16-n"><carbon-firewall />WAF</div><div class="s16-c" v-click="3">method allowlist · inspect QUERY bodies like POST bodies · size limits</div></div>
  <div class="s16-r"><div class="node s16-n"><carbon-gateway-api />Gateway / proxy</div><div class="s16-c" v-click="4">consistent message framing (no smuggling) · rate limits · 405 / 501 handling</div></div>
  <div class="s16-r"><div class="node s16-n"><carbon-application />Application</div><div class="s16-c" v-click="5">authN + per-query authZ · strict Content-Type · validation · cost limits · body logging</div></div>
  <div class="s16-r"><div class="node s16-n"><carbon-data-base />Database / search</div><div class="s16-c" v-click="6">parameterised queries (no injection) · timeouts · result-size caps</div></div>
</div>
<div class="s16-src">Sources: <Cite r="10008" s="2.7" /> <Cite t="Fetch" href="https://fetch.spec.whatwg.org/#cors-protocol" /> <Cite r="9112" s="6" /> <Cite t="Jabiyev et al., 2021" href="https://doi.org/10.1145/3460120.3485384" /> <Cite t="Chen et al., 2016" href="https://doi.org/10.1145/2976749.2978394" /> <Cite t="OWASP WSTG-CONF-06" href="https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods" /></div>

<style>
.s16 { display: flex; flex-direction: column; gap: 8px; }
.s16-r { display: grid; grid-template-columns: 205px 1fr; gap: 14px; align-items: center; }
.s16-n { flex-direction: row; justify-content: flex-start; gap: 8px; padding: 6px 10px; font-size: 18px; }
.s16-n svg { font-size: 22px; margin: 0; }
.s16-c { font-size: 19px; line-height: 1.22; border-left: 3px solid var(--brown); padding-left: 10px; }
.s16-src { margin-top: 10px; font-size: 14px; }
</style>

<!--
⏱ 0:55 (ends 15:05) · Sources: RFC 10008 §2.1, §2.7, §4; Fetch; RFC 9112 §6; Jabiyev et al. 2021; Chen et al. 2016; OWASP WSTG-CONF-06

SAY: The threat model, layer by layer.

[click] Browser: the CORS preflight and allowed origins, the credentials mode, and one trap: fetch() only uppercases the six classic method names, so lowercase "query" is sent as a different, case-sensitive method.

[click] CDN and cache: the key must include content and type, normalisation must be safe; poisoning and deception are the attacks.

[click] WAF: QUERY must be on the allowlist, and rules written for "GET parameters" and "POST bodies" must also inspect QUERY bodies, or QUERY becomes a way around them. OWASP's HTTP-method test case covers bypassing access controls with another or unknown method.

[click] Gateway and reverse proxy: RFC 9112 says framing is independent of the method, so a conforming proxy can forward a QUERY body. But T-Reqs showed parsing discrepancies between hops are common and lead to request smuggling; "Host of Troubles" showed the same class of ambiguity for Host headers. Unsupported methods need consistent 405 or 501 answers.

[click] Application: authentication and per-query authorisation, strict Content-Type checks as RFC 10008 requires, validation, cost limits, care with body logging.

[click] Database: parameterised queries, timeouts, result-size caps.

NOTICE: Little of this is new; what's new is that every layer must recognise QUERY and treat its body correctly.

NEXT → One concrete API.
-->

---
section: 4. Description
frame: desc
clicks: 2
---

# Worked example: a user-search API

<table class="tbl s17">
  <thead><tr><th>Concern</th><th><M t="GET" /> <span class="s17-f">?email=alice@…</span></th><th><M t="POST" /> <span class="s17-f">{"email": …}</span></th><th><M t="QUERY" /> <span class="s17-f">{"email": …}</span></th></tr></thead>
  <tbody>
    <tr><td>Email in the URI (logs, history)</td><td><span class="bad">✗</span> Exposed</td><td><span class="ok">✓</span> Avoided</td><td><span class="ok">✓</span> Avoided</td></tr>
    <tr><td>Safe intent visible to caches</td><td><span class="ok">✓</span> Yes</td><td><span class="bad">✗</span> Opaque</td><td><span class="ok">✓</span> Yes</td></tr>
    <tr><td>Body may be logged or inspected</td><td>n/a</td><td><span class="bad">!</span> Yes</td><td><span class="bad">!</span> Yes</td></tr>
    <tr v-click="1"><td>Authorization for admin lookups</td><td><b>Required</b></td><td><b>Required</b></td><td><b>Required</b></td></tr>
    <tr v-click="1"><td>Validation, injection defences</td><td><b>Required</b></td><td><b>Required</b></td><td><b>Required</b></td></tr>
    <tr v-click="1"><td>Rate and cost limits (DoS)</td><td><b>Required</b></td><td><b>Required</b></td><td><b>Required</b></td></tr>
  </tbody>
</table>
<div v-click="2" class="card cd-orange s17-msg">QUERY changes the <b>semantics</b> and <b>where the data travels</b>. It does not remove the need for authorization, validation, logging hygiene or limits.</div>

<style>
.s17 { font-size: 19px; }
.s17 td, .s17 th { padding: 5px 9px; }
.s17 td:first-child { font-weight: 700; width: 36%; }
.s17-f { font-family: var(--courier); font-size: 14px; font-weight: 700; display: block; margin-top: 2px; }
.s17-msg { margin-top: 12px; font-size: 21px; line-height: 1.25; }
</style>

<!--
⏱ 0:40 (ends 15:45) · Sources: RFC 10008 §4; RFC 9110 §17.9

SAY: An admin API that searches users by email and role, written three ways. The top three rows are where the methods differ. GET puts the email in the URI. POST and QUERY keep it out. Only GET and QUERY tell caches and retrying clients this is a safe read. For POST and QUERY the body can still be logged or inspected: exposure moves rather than disappears.

[click] The bottom three rows are identical: authorisation, validation and injection defences, and rate and cost limits. The method changes none of these.

[click] My core claim: QUERY changes semantics and where the data travels; it is not a security control in itself.

NEXT → And deployment is where a new method runs into trouble.
-->

---
section: 4. Description
frame: desc
clicks: 1
---

# Standardised is not the same as deployed

<div class="s18">
  <div class="card cd-lav">
    <div class="s18-h">Protocol level: set by RFC 10008</div>
    <ul class="bul s18-l">
      <li>safe + idempotent semantics</li>
      <li>Content-Type required; 4xx rules</li>
      <li>cacheable; content in the cache key</li>
      <li>Accept-Query, Location, Content-Location</li>
      <li>redirect rules; CORS preflight</li>
    </ul>
  </div>
  <div class="card cd-brown">
    <div class="s18-h">Deployment level: decided at every hop</div>
    <ul class="bul s18-l">
      <li>method allowlists (LB, WAF, gateway): 405 / 501 <Cite r="9110" s="9.1" /></li>
      <li>proxy / CDN forwarding and caching of QUERY</li>
      <li>framework routing and body parsing</li>
      <li>CORS configuration · clients: <span class="kbd">"query"</span> ≠ <span class="kbd">"QUERY"</span></li>
      <li>logs, SIEM parsers · API docs: OpenAPI 3.2 has <span class="kbd">query</span> <Cite t="OAS 3.2" href="https://spec.openapis.org/oas/v3.2.0.html" /></li>
    </ul>
  </div>
</div>
<div class="s18-chain" v-click="1">
  <span>Browser</span><b>→</b><span>CDN</span><b>→</b><span>Load balancer</span><b>→</b><span>WAF</span><b>→</b><span>Reverse proxy</span><b>→</b><span>Framework</span><b>→</b><span>Application</span>
  <div class="s18-cap">One unsupported hop can break QUERY, or let it slip past a control.</div>
</div>

<style>
.s18 { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 16px; }
.s18-h { font-size: 21px; font-weight: 700; color: var(--brown); margin-bottom: 2px; }
.s18-l > li { font-size: 19px; margin-top: 5px; }
.s18-chain { margin-top: 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 7px; }
.s18-chain span { font-size: 18px; font-weight: 700; border: 1.5px solid var(--indigo); background: var(--lav); padding: 3px 10px; }
.s18-chain b { font-size: 18px; }
.s18-cap { width: 100%; margin-top: 8px; font-size: 21px; font-weight: 700; color: var(--brown); }
</style>

<!--
⏱ 0:40 (ends 16:25) · Sources: RFC 10008; RFC 9110 §9.1; Fetch §2.2.1; OpenAPI 3.2.0

SAY: Publishing an RFC and making it work in production are separate problems. On the left, what RFC 10008 fixes at the protocol level; all settled. On the right, what every hop decides for itself: method allowlists, where RFC 9110 says an unknown method gets 501 and a disallowed one 405; forwarding and caching; framework routing and body parsing; CORS; client libraries, since fetch() won't uppercase "query"; and logging and SIEM parsers. On the positive side, OpenAPI 3.2, released September 2025, already has a "query" operation.

[click] So the whole chain matters: one unsupported hop breaks QUERY, and a hop that passes it through without its GET and POST controls turns it into a bypass.

NEXT → My conclusion.
-->

---
section: Conclusion
frame: concl
clicks: 2
---

<div class="s21">
  <div class="card cd-lav s21-c"><M t="GET" /><div class="s21-id">URI-oriented retrieval</div><ul class="bul"><li>query fits in the URI</li><li>links and caching matter</li></ul></div>
  <div class="s21-a">semantic<br>gap<br>→</div>
  <div class="card cd-orange s21-c"><M t="QUERY" /><div class="s21-id">Safe, body-oriented query</div><ul class="bul"><li>the operation <i>is</i> a query</li><li>large or structured input</li><li>every hop supports it</li></ul></div>
  <div class="s21-a">broader<br>operations<br>→</div>
  <div class="card cd-brown s21-c"><M t="POST" /><div class="s21-id">General processing</div><ul class="bul"><li>operation is not safe</li><li>changes state, submits</li></ul></div>
</div>
<ul class="bul s21-take">
  <li v-click="1"><b>QUERY is not a replacement for GET or POST.</b> It fills a semantic gap: safe, idempotent queries with structured request content.</li>
  <li v-click="2">Its cybersecurity value depends on how clients, intermediaries, caches, gateways, applications and logs <b>implement</b> it, not on the method alone.</li>
</ul>

<style>
.s21 { display: grid; grid-template-columns: 1fr 76px 1fr 76px 1fr; align-items: stretch; }
.s21-c { font-size: 19px; padding: 10px 12px; }
.s21-c .mpill { font-size: 21px; }
.s21-id { font-size: 21px; font-weight: 700; color: var(--brown); margin: 6px 0 2px; line-height: 1.15; }
.s21-c .bul > li { font-size: 19px; margin-top: 3px; padding-left: 20px; }
.s21-a { display: flex; align-items: center; justify-content: center; text-align: center; font-size: 16px; font-weight: 700; line-height: 1.2; }
.s21-take { margin-top: 18px; }
.s21-take > li { font-size: 22px; margin-top: 10px; }
</style>

<!--
⏱ 0:45 (ends 17:10)

SAY: To conclude, this isn't a contest with a winner. Use GET when the query fits naturally in a URI and you want links, bookmarks and mature caching. Use QUERY when the operation really is a safe, idempotent query with large or structured input, and every hop supports it. Use POST when the operation isn't safe.

[click] First takeaway: QUERY is not a replacement for GET or POST; it fills the semantic gap between them.

[click] Second, the cybersecurity takeaway: the method doesn't provide security by itself. Its value depends on how clients, intermediaries, caches, gateways, applications and logging implement it, so security teams need to be involved from the start of adoption.

NEXT → References, then questions.
-->

---
section: References
frame: refs
---

<div class="refs">
  <p><span>[1]</span>J. Reschke, J. M. Snell, and M. Bishop, “<a href="https://www.rfc-editor.org/rfc/rfc10008.html">The HTTP QUERY Method</a>,” RFC 10008, IETF, Jun. 2026, doi: 10.17487/RFC10008.</p>
  <p><span>[2]</span>R. Fielding, M. Nottingham, and J. Reschke, Eds., “<a href="https://www.rfc-editor.org/rfc/rfc9110.html">HTTP Semantics</a>,” STD 97, RFC 9110, Jun. 2022.</p>
  <p><span>[3]</span>R. Fielding, M. Nottingham, and J. Reschke, Eds., “<a href="https://www.rfc-editor.org/rfc/rfc9111.html">HTTP Caching</a>,” STD 98, RFC 9111, Jun. 2022.</p>
  <p><span>[4]</span>R. Fielding, M. Nottingham, and J. Reschke, Eds., “<a href="https://www.rfc-editor.org/rfc/rfc9112.html">HTTP/1.1</a>,” STD 99, RFC 9112, Jun. 2022.</p>
  <p><span>[5]</span>T. Berners-Lee, R. Fielding, and L. Masinter, “<a href="https://www.rfc-editor.org/rfc/rfc3986.html">Uniform Resource Identifier (URI): Generic Syntax</a>,” STD 66, RFC 3986, Jan. 2005.</p>
  <p><span>[6]</span>M. Nottingham, “<a href="https://www.rfc-editor.org/rfc/rfc9205.html">Building Protocols with HTTP</a>,” BCP 56, RFC 9205, Jun. 2022.</p>
  <p><span>[7]</span>A. Backman, J. Richer, and M. Sporny, Eds., “<a href="https://www.rfc-editor.org/rfc/rfc9421.html">HTTP Message Signatures</a>,” RFC 9421, Feb. 2024.</p>
  <p><span>[8]</span>R. Polli and L. Pardue, “<a href="https://www.rfc-editor.org/rfc/rfc9530.html">Digest Fields</a>,” RFC 9530, Feb. 2024.</p>
  <p><span>[9]</span>WHATWG, “<a href="https://fetch.spec.whatwg.org/">Fetch Standard</a>” and “<a href="https://html.spec.whatwg.org/">HTML Standard</a>,” Living Standards.</p>
  <p><span>[10]</span>W3C, “<a href="https://www.w3.org/TR/referrer-policy/">Referrer Policy</a>.”</p>
  <p><span>[11]</span>IANA, “<a href="https://www.iana.org/assignments/http-methods/">Hypertext Transfer Protocol (HTTP) Method Registry</a>.”</p>
  <p><span>[12]</span>OpenAPI Initiative, “<a href="https://spec.openapis.org/oas/v3.2.0.html">OpenAPI Specification v3.2.0</a>,” Sep. 2025.</p>
  <p><span>[13]</span>OWASP, “<a href="https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods">WSTG-CONF-06: Test HTTP Methods</a>,” Web Security Testing Guide.</p>
  <p><span>[14]</span>MDN Web Docs, “<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">Cross-Origin Resource Sharing (CORS)</a>.”</p>
</div>

<!--
Not presented. Titles link to the official sources.
-->

---
section: References
frame: refs
---

<div class="refs">
  <p><span>[15]</span>O. Starov, P. Gill, and N. Nikiforakis, “<a href="https://doi.org/10.1515/popets-2015-0028">Are You Sure You Want to Contact Us? Quantifying the Leakage of PII via Website Contact Forms</a>,” Proc. Privacy Enhancing Technologies, vol. 2016, no. 1, pp. 20–33, 2016, doi: 10.1515/popets-2015-0028.</p>
  <p><span>[16]</span>H. V. Nguyen, L. Lo Iacono, and H. Federrath, “<a href="https://doi.org/10.1145/3319535.3354215">Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack</a>,” in Proc. ACM CCS, 2019, pp. 1915–1936, doi: 10.1145/3319535.3354215.</p>
  <p><span>[17]</span>S. A. Mirheidari, S. Arshad, K. Onarlioglu, B. Crispo, E. Kirda, and W. Robertson, “<a href="https://www.usenix.org/conference/usenixsecurity20/presentation/mirheidari">Cached and Confused: Web Cache Deception in the Wild</a>,” in Proc. 29th USENIX Security Symposium, 2020.</p>
  <p><span>[18]</span>B. Jabiyev, S. Sprecher, K. Onarlioglu, and E. Kirda, “<a href="https://doi.org/10.1145/3460120.3485384">T-Reqs: HTTP Request Smuggling with Differential Fuzzing</a>,” in Proc. ACM CCS, 2021, pp. 1805–1820, doi: 10.1145/3460120.3485384.</p>
  <p><span>[19]</span>J. Chen, J. Jiang, H. Duan, T. Wan, S. Chen, V. Paxson, and M. Yang, “<a href="https://www.usenix.org/conference/usenixsecurity18/presentation/chen-jianjun">We Still Don’t Have Secure Cross-Domain Requests: an Empirical Study of CORS</a>,” in Proc. 27th USENIX Security Symposium, 2018.</p>
  <p><span>[20]</span>A. Cha, E. Wittern, G. Baudart, J. C. Davis, L. Mandel, and J. A. Laredo, “<a href="https://doi.org/10.1145/3368089.3409670">A Principled Approach to GraphQL Query Cost Analysis</a>,” in Proc. ESEC/FSE, 2020, pp. 257–268, doi: 10.1145/3368089.3409670.</p>
  <p><span>[21]</span>O. Hartig and J. Pérez, “<a href="https://doi.org/10.1145/3178876.3186014">Semantics and Complexity of GraphQL</a>,” in Proc. The Web Conference (WWW), 2018, pp. 1155–1164, doi: 10.1145/3178876.3186014.</p>
  <p><span>[22]</span>J. Chen, J. Jiang, H. Duan, N. Weaver, T. Wan, and V. Paxson, “<a href="https://doi.org/10.1145/2976749.2978394">Host of Troubles: Multiple Host Ambiguities in HTTP Implementations</a>,” in Proc. ACM CCS, 2016, pp. 1516–1527, doi: 10.1145/2976749.2978394.</p>
</div>

<!--
Not presented. DOIs and page ranges verified against Crossref; USENIX papers link to the official proceedings pages.
-->

---
layout: queries
---

<!--
⏱ Q&A (2–3 min)

Likely questions and short answers:

• "Why not just send a body with GET?" RFC 9110 §9.3.1: GET content has no generally defined semantics and some implementations reject it (request-smuggling risk). RFC 9205 §4.5.1: generic HTTP software will ignore or reject it.

• "Why a new method instead of SEARCH, REPORT or PROPFIND?" RFC 10008 Appendix B: those come from WebDAV and depend on a generic XML media type; "QUERY" maps onto the URI's query component. Early drafts did use SEARCH.

• "Is QUERY more secure than GET?" Not inherently. It avoids URI exposure, but bodies can be logged, it adds cache-key complexity, and it needs support at every hop.

• "Can browsers send it?" Yes, with fetch(); cross-origin always triggers a preflight. HTML forms can't send it.

• "Does QUERY help against CSRF?" It is safe, so it shouldn't change state; cross-site pages can't send it without a preflight, but a misconfigured CORS policy can still leak the results.
-->

---
layout: thank-you
---
