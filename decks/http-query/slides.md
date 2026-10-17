---
theme: ../../templates/msis-seminar
title: HTTP QUERY Method
author: Anish Shobith
info: |
  HTTP QUERY Method: A Security-Focused Literature Survey and Analysis.
  M.E. CyberSecurity technical seminar, Manipal School of Information Sciences, MAHE, Manipal.
  Built on the MSIS Seminar Template 2026-27 with shadcn-vue primitives (addons/shadcn).
duration: 21min # 18:30 of talk (notes are timed) + 2 to 3 min of questions
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
⏱ 0:25 (ends 0:25) · Source: RFC 10008

SAY: Good morning. My seminar is about the HTTP QUERY method. The IETF published it as RFC 10008 in June 2026. First, I show how HTTP methods work. Then I show what QUERY changes. Most of the time is about security and deployment.

NEXT → The outline.
-->

---
layout: outline
items:
  - 'Introduction: HTTP methods, URIs and the gap between GET and POST'
  - Objectives
  - 'Literature Review: standards and studies'
  - 'Description: the QUERY method, code and security'
  - Conclusion
---

<!--
⏱ 0:20 (ends 0:45)

SAY: This is the seminar format. The description is the main part. It shows what QUERY is and how clients and servers use it. It also shows what QUERY changes for caches, browsers, signatures and deployment.

NEXT → What an HTTP request contains.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
---

<script setup>
import exchange from './snippets/get-exchange.http?raw'
</script>

# An HTTP request and its response

<div class="grid grid-cols-[minmax(0,1fr)_380px] gap-6">
  <Snippet :code="exchange" lang="http" title="a GET exchange" dense :callouts="{ 1: '1', 4: '2', 6: '3', 10: '4' }" />
  <div class="flex flex-col gap-5">
    <ul class="legend-v">
      <li><Badge>1</Badge><span><b>Method and target URI.</b> The query is in the URI.</span></li>
      <li><Badge>2</Badge><span><b>Headers.</b> Here: the format and the credentials.</span></li>
      <li><Badge>3</Badge><span><b>Status line.</b> The result of the request.</span></li>
      <li><Badge>4</Badge><span><b>Content.</b> A GET request has none <Cite r="9110" s="9.3.1" /></span></li>
    </ul>
    <Alert class="border-2 border-primary py-2">
      <AlertDescription class="text-lg text-foreground">The <b>method</b> tells each hop what the client wants to do <Cite r="9110" s="9.1" /></AlertDescription>
    </Alert>
  </div>
</div>

<!--
⏱ 0:50 (ends 1:35) · Sources: RFC 9110 §9.1, §9.3.1

SAY: This is a full GET exchange. Item one is the method and the target URI. The query, category=laptop, is part of the URI. Item two is the headers: here, the format and a bearer token. Item three is the status line with the result. Item four is the response content.

The request itself has no content. RFC 9110 says that content in a GET request has no defined meaning. Thus "add a body to GET" is not a good solution.

The box at the bottom is the main idea. RFC 9110 calls the method the primary source of request semantics. Each hop reads it to know what the client wants.

NEXT → The two properties of a method.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
---

# Safe and idempotent methods

<div class="grid grid-cols-[430px_minmax(0,1fr)] items-start gap-8">
  <Table class="text-xl">
    <TableHeader>
      <TableRow class="border-b-2"><TableHead>Methods</TableHead><TableHead class="text-center">Safe</TableHead><TableHead class="text-center">Idem&shy;potent</TableHead></TableRow>
    </TableHeader>
    <TableBody class="[&_td]:py-3">
      <TableRow><TableCell class="space-x-1"><M t="GET" /><M t="HEAD" /><M t="OPTIONS" /></TableCell><TableCell class="text-center font-bold text-chart-3">yes</TableCell><TableCell class="text-center font-bold text-chart-3">yes</TableCell></TableRow>
      <TableRow><TableCell class="space-x-1"><M t="PUT" /><M t="DELETE" /></TableCell><TableCell class="text-center font-bold text-destructive">no</TableCell><TableCell class="text-center font-bold text-chart-3">yes</TableCell></TableRow>
      <TableRow><TableCell class="space-x-1"><M t="POST" /><M t="PATCH" /></TableCell><TableCell class="text-center font-bold text-destructive">no</TableCell><TableCell class="text-center font-bold text-destructive">no</TableCell></TableRow>
    </TableBody>
  </Table>
  <ul class="bul big">
    <li><b>Safe</b>: the client does not ask for a change. Caches, prefetchers and crawlers can send it <Cite r="9110" s="9.2.1" /></li>
    <li><b>Idempotent</b>: a repeated request has the same intended effect. A client can send it again <Cite r="9110" s="9.2.2" /></li>
    <li><b>Neither</b>: a proxy <b>must not</b> send it again automatically <Cite r="9110" s="9.2.2" /></li>
    <li>All safe methods are also idempotent</li>
  </ul>
</div>

<!--
⏱ 0:40 (ends 2:15) · Sources: RFC 9110 §9.2.1, §9.2.2

SAY: Two properties of a method are important for this talk. The table shows them. A safe method does not ask for a change of state. Thus a cache, a prefetcher or a crawler can send it with no risk. An idempotent method has the same intended effect when you send it again. Thus a client can send it again after a connection fails. POST and PATCH are neither safe nor idempotent. A proxy must not send them again automatically.

CLARIFY: Method names are case-sensitive (RFC 9110 §9.1). This is important later in the talk.

NEXT → Where the query goes in a GET request.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
---

# The parts of a URI

<div class="uri uri-lg">
  <span class="seg u1">https<span class="lab">scheme</span></span><span class="dl">://</span><span class="seg u2">shop.example<span class="lab">authority</span></span><span class="seg u3">/search<span class="lab">path</span></span><span class="seg u4">?q=laptop&amp;page=2<span class="lab">query</span></span><span class="seg u5">#results<span class="lab">fragment</span></span>
</div>

<div class="grid grid-cols-2 items-start gap-8">
  <ul class="bul big">
    <li>The <b>query</b> and the path together identify the resource <Cite r="3986" s="3.4" /></li>
    <li>The browser does not send the <b>fragment</b> to the server <Cite r="3986" s="3.5" /></li>
  </ul>
  <Alert class="border-2 border-primary">
    <AlertTitle class="text-xl font-bold text-destructive">Two different things, one word</AlertTitle>
    <AlertDescription class="text-lg text-foreground">The URI <b>query component</b> is part of an identifier. The <M t="QUERY" /> <b>method</b> sends its input as content: the “query content” <Cite r="10008" s="1.1" />.</AlertDescription>
  </Alert>
</div>

<!--
⏱ 0:35 (ends 2:50) · Sources: RFC 3986 §3, §3.4, §3.5; RFC 10008 §1.1

SAY: A URI has five parts. The query comes after the question mark. Together with the path, it identifies a resource. The fragment stays in the browser. The browser does not send it.

The box on the right is important for the rest of the talk. The query component of a URI and the QUERY method only share a word. The RFC calls the input of a QUERY request the "query content".

NEXT → What happens when the query in the URI grows.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
---

<script setup>
import longGet from './snippets/long-get.http?raw'
</script>

# Problems when the query grows

<div class="grid grid-cols-[minmax(0,1fr)_400px] gap-6">
  <Snippet :code="longGet" lang="http" title="the same search, with more filters" dense wrap lines="1" />
  <ul class="bul big">
    <li><b>No fixed limit.</b> HTTP recommends at least 8000 octets <Cite r="9110" s="4.1" /></li>
    <li><b>Unknown limits.</b> Each hop can have a different limit <Cite r="10008" s="1" /></li>
    <li><b>414 URI Too Long</b>: the reply when the URI is too long for the server <Cite r="9110" s="15.5.15" /></li>
    <li><b>Encoding cost.</b> Here, 30 characters of JSON become 54 <Cite r="10008" s="1" /></li>
  </ul>
</div>

<!--
⏱ 0:45 (ends 3:35) · Sources: RFC 9110 §4.1, §15.5.15; RFC 10008 §1

SAY: Query parameters are good for small inputs. On the left is the same search with more filters: brands, prices, memory, sort, page, and a JSON filter. The JSON filter has percent-encoding. The server replies 414 URI Too Long.

The list on the right gives the facts. HTTP has no single maximum length. RFC 9110 only recommends at least 8000 octets. RFC 10008 gives the real problem: a request goes through many hops, and the client cannot know their limits. Encoding also adds length. In this example, 30 characters of JSON become 54.

NEXT → A long URI is also a security problem, because many systems record it.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
---

<script setup>
import accessLog from './snippets/access.log?raw'
</script>

# Where the URI is recorded

<div class="hops">
  <div v-for="h in [['Browser', 'history, bookmarks'], ['CDN / proxy', 'edge access logs'], ['WAF', 'request logs, alerts'], ['Reverse proxy', 'access log'], ['Application', 'app logs, APM'], ['SIEM', 'indexed, kept']]" :key="h[0]" class="hop">
    <b>{{ h[0] }}</b><span>{{ h[1] }}</span>
  </div>
</div>

<Snippet :code="accessLog" title="access.log (nginx “combined” format)" size="sm" dense wrap removed="1" added="2" />

<div class="mt-4 grid grid-cols-2 gap-4">
  <Card class="gap-1 py-3">
    <CardHeader class="px-4"><CardTitle class="text-xl text-destructive">URI exposure</CardTitle></CardHeader>
    <CardContent class="px-4 text-lg">Access logs, history and bookmarks keep the URI. The <code>Referer</code> header sends it on the next same-origin request <Cite r="9110" s="17.9" /></CardContent>
  </Card>
  <Card class="gap-1 py-3">
    <CardHeader class="px-4"><CardTitle class="text-xl text-destructive">Content exposure</CardTitle></CardHeader>
    <CardContent class="px-4 text-lg">Body logs, WAF and APM tools and each TLS-terminating hop can see the content. Logs keep it less often, <i>but not never</i> <Cite r="10008" s="4" /></CardContent>
  </Card>
</div>

<!--
⏱ 1:05 (ends 4:40) · Sources: RFC 9110 §17.9; RFC 10008 §4; W3C Referrer Policy

SAY: An administrator searches for users by email. The email is in the query component. A normal production path records it at each hop. The browser keeps it in history. The CDN, the WAF, the reverse proxy and the application write it to their logs. At the end, a SIEM indexes and keeps it.

The red line is a real access-log line in the default "combined" format of nginx. It includes the email. The green line is the same search, sent as QUERY. The request line has only the path.

RFC 9110 says it clearly: URIs are for sharing, not for secrets. The Referer header also sends the full URI on the next same-origin request.

But the right card is equally important. A body has less exposure, not zero exposure. Systems can log and examine bodies too. "More likely to be logged" does not mean "always".

CLARIFY: Cross-origin, browsers now send only the origin in Referer by default (strict-origin-when-cross-origin). Same-origin requests still get the full URL.

NEXT → So developers move the query out of the URI, and they find a gap.
-->

---
section: 1. Introduction
tsize: 36
frame: intro
clicks: 1
---

# The gap between GET and POST

<div class="grid grid-cols-[minmax(0,1fr)_270px] gap-5">
  <div class="gapgrid">
    <div />
    <div class="gg-ch">query input in the <b>URI</b></div>
    <div class="gg-ch">query input in the <b>content</b></div>
    <div class="gg-rh">Safe and idempotent</div>
    <Card class="gg-cell"><M t="GET" /><div>gets a resource; the query is part of the URI</div></Card>
    <Card class="gg-cell" :class="$clicks ? 'border-2 border-primary' : 'border-2 border-dashed border-primary'">
      <template v-if="!$clicks"><div class="gg-q">?</div><div class="text-center">no standard method</div></template>
      <template v-else><M t="QUERY" /><div>safe and idempotent; the query is in the content <Cite r="10008" s="2" /></div></template>
    </Card>
    <div class="gg-rh">Not safe, general processing</div>
    <Card class="gg-cell"><code>GET /item?do=delete</code><div>bad practice: the owner must disallow it <Cite r="9110" s="9.2.1" /></div></Card>
    <Card class="gg-cell"><M t="POST" /><div>the resource decides what to do with the content <Cite r="9110" s="9.3.3" /></div></Card>
  </div>
  <div class="flex flex-col gap-3">
    <Card class="gap-0 py-3"><CardContent class="px-3 text-base italic">POST for a query “hinders caching and uses an unsafe method for what would otherwise be a safe request.” <Cite r="9110" s="17.9" /></CardContent></Card>
    <Alert v-click="1" class="border-2 border-primary">
      <AlertTitle class="text-lg font-bold text-destructive">Not a replacement</AlertTitle>
      <AlertDescription class="text-base text-foreground">QUERY fills the gap. If the query fits in a URI, use GET. If the request changes data, use POST.</AlertDescription>
    </Alert>
  </div>
</div>

<!--
⏱ 0:55 (ends 5:35) · Sources: RFC 9110 §9.2.1, §9.3.3, §17.9; RFC 10008 §2

SAY: This grid shows the open issue. The columns show where the query input is: in the URI or in the content. The rows show what the method promises. GET is at the top left. POST is at the bottom right. The bottom left is bad practice: an action behind a safe method. RFC 9110 says that the owner must disallow it.

The top right was empty. HTTP had no standard method for "a safe, idempotent query with the input in the body". RFC 9110 itself admits this in section 17.9. The quote is on the right.

[click] QUERY fills exactly this cell. It does not replace the other methods. If the query fits in a URI, use GET. If the request changes data, use POST.

NEXT → This gap gives the objectives.
-->

---
section: 2. Objectives
frame: obj
---

<ul class="bul obj">
  <li>Explain how HTTP methods tell each hop what a request does</li>
  <li>Show the size and exposure problems of a query in the URI</li>
  <li>Analyse the QUERY method of RFC 10008 with client and server code</li>
  <li>Identify the security effects on browsers, caches, WAFs, gateways and applications</li>
  <li>Review the standards and studies that QUERY depends on</li>
  <li>Recommend when to use GET, QUERY or POST</li>
</ul>

<!--
⏱ 0:25 (ends 6:00)

SAY: My objectives come from that gap. First, the basics of HTTP methods and URIs. Then the main part: what RFC 10008 specifies, with client and server code that I ran. The security objective is the most important one. Then the literature, and a recommendation.

NEXT → The literature review. First, the standards.
-->

---
section: 3. Literature Review
frame: lit
---

<LitTable :size="18" :rows="[
  { authors: 'J. Reschke, J. M. Snell, M. Bishop', title: 'The HTTP QUERY Method', href: 'https://www.rfc-editor.org/rfc/rfc10008.html', venue: 'RFC 10008, 2026', dataset: 'IETF Standards Track specification', purpose: 'Define a safe, idempotent method that sends the query as request content', findings: 'Content-Type is mandatory. Responses are cacheable, and the cache key must include the content. New Accept-Query header. Browsers send a CORS preflight' },
  { authors: 'R. Fielding, M. Nottingham, J. Reschke (Eds.)', title: 'HTTP Semantics', href: 'https://www.rfc-editor.org/rfc/rfc9110.html', venue: 'RFC 9110, 2022', dataset: 'IETF Internet Standard (STD 97)', purpose: 'Define the meaning of HTTP methods, and the safe and idempotent properties', findings: 'Safe and idempotent describe what the client intends. URIs are not secure. POST for a safe query “uses an unsafe method” (§17.9)' },
  { authors: 'M. Nottingham', title: 'Building Protocols with HTTP', href: 'https://www.rfc-editor.org/rfc/rfc9205.html', venue: 'RFC 9205 (BCP 56), 2022', dataset: 'IETF Best Current Practice', purpose: 'Give rules for the design of HTTP-based APIs', findings: 'Queries in a GET URI can become too long and hard to encode. Queries in POST lose caching and links' },
]" />

<!--
⏱ 0:45 (ends 6:45) · Sources: RFC 10008; RFC 9110; RFC 9205

SAY: The primary sources are three standards. RFC 10008 defines QUERY. A request must have a Content-Type. Caches can keep the responses, but the cache key must include the content. There is a new header, Accept-Query. And browsers must send a CORS preflight.

RFC 9110 defines the meaning of the methods that I used in the introduction. It also admits that POST for a query is a compromise. RFC 9205 is the best-practice guide of the IETF for HTTP APIs. It says that GET queries can become too long, and that POST queries lose caching and links.

CLARIFY: "Dataset" is a column of the template. For a standard, it gives the type of document. RFC 9421 (signatures) and the other standards are in the references.

NEXT → The peer-reviewed studies.
-->

---
section: 3. Literature Review
frame: lit
---

<LitTable :size="16" :rows="[
  { authors: 'H. V. Nguyen et al.', title: 'Your Cache Has Fallen: Cache-Poisoned Denial-of-Service Attack', href: 'https://doi.org/10.1145/3319535.3354215', venue: 'ACM CCS, 2019', dataset: '15 web caching systems (proxy caches and CDNs)', purpose: 'Study attacks that make a cache send an error page to all users', findings: 'New attack class, CPDoS. 1 proxy cache and 5 CDN services were vulnerable' },
  { authors: 'S. A. Mirheidari et al.', title: 'Cached and Confused: Web Cache Deception in the Wild', href: 'https://www.usenix.org/conference/usenixsecurity20/presentation/mirheidari', venue: 'USENIX Security, 2020', dataset: '340 high-profile sites (Alexa Top 5K)', purpose: 'Measure web cache deception and its variants', findings: 'Caches leaked private data and tokens, two years after the attack became public' },
  { authors: 'B. Jabiyev et al.', title: 'T-Reqs: HTTP Request Smuggling with Differential Fuzzing', href: 'https://doi.org/10.1145/3460120.3485384', venue: 'ACM CCS, 2021', dataset: '10 popular servers, proxies and CDNs, tested in pairs', purpose: 'Find HTTP processing differences that allow request smuggling', findings: 'Differential fuzzing found new smuggling methods and vulnerable server pairs' },
  { authors: 'J. Chen et al.', title: 'We Still Don’t Have Secure Cross-Domain Requests: an Empirical Study of CORS', href: 'https://www.usenix.org/conference/usenixsecurity18/presentation/chen-jianjun', venue: 'USENIX Security, 2018', dataset: 'Real-world CORS design, implementation and deployment', purpose: 'Measure the security of CORS in practice', findings: 'CORS adds risky trust relations and is often configured incorrectly' },
]" />

<p class="lit-note">No peer-reviewed study of RFC 10008 itself was found (Oct 2026). These studies examine the mechanisms that QUERY uses.</p>

<!--
⏱ 0:55 (ends 7:40) · Sources: Nguyen et al. 2019; Mirheidari et al. 2020; Jabiyev et al. 2021; Chen et al. 2018

SAY: I found no peer-reviewed work on RFC 10008 itself. This is normal for a standard from June 2026. Thus these four studies examine the mechanisms that QUERY uses. All four are from top security venues.

Nguyen and colleagues found cache-poisoned denial of service: one proxy and five CDNs kept an error page and sent it to all users. Mirheidari and colleagues found web cache deception on high-profile sites. Caches leaked private data and tokens. The lesson of both papers: when the cache and the origin disagree, the attacker wins.

T-Reqs found request smuggling between pairs of servers. A new method with a body is new input for these bugs. And Chen and colleagues found that CORS is often configured incorrectly. Every cross-origin QUERY uses CORS.

CLARIFY: Starov et al. (PII leaks through Referer), Cha et al. and Hartig & Pérez (GraphQL query cost) are in the references.

NEXT → The description. First, what QUERY is.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import feedGet from './snippets/feed-get.http?raw'
import feedPost from './snippets/feed-post.http?raw'
import feedQuery from './snippets/feed-query.http?raw'
</script>

# The same query in three ways (RFC 10008 §1)

<div class="grid grid-cols-[minmax(0,1fr)_340px] gap-6">
  <div class="flex flex-col gap-2">
    <Snippet :code="feedGet" lang="http" title="GET" size="sm" dense lines="1" />
    <Snippet :code="feedPost" lang="http" title="POST" size="sm" dense lines="5" />
    <Snippet :code="feedQuery" lang="http" title="QUERY" size="sm" dense lines="1,5" />
  </div>
  <ul class="bul big">
    <li><M t="GET" /> the input is in the URI</li>
    <li><M t="POST" /> the input is in the content, but the method does not promise “safe”</li>
    <li><M t="QUERY" /> the same content as POST, with a safe and idempotent method</li>
  </ul>
</div>

<!--
⏱ 0:30 (ends 8:10) · Sources: RFC 10008 §1

SAY: These three requests come from the introduction of the RFC. GET puts q, limit and sort in the URI. The usual workaround is POST: the same parameters as form-encoded content. But POST does not tell a cache, a proxy or a client that this request is a harmless read. QUERY keeps exactly the POST content. It changes only the method.

NEXT → The RFC's own comparison table.
-->

---
section: 4. Description
frame: desc
---

# GET, QUERY and POST compared (RFC 10008 Table 1)

<Table class="cmp text-xl">
  <TableHeader>
    <TableRow class="border-b-2"><TableHead class="w-[260px]" /><TableHead><M t="GET" /></TableHead><TableHead><M t="QUERY" /></TableHead><TableHead><M t="POST" /></TableHead></TableRow>
  </TableHeader>
  <TableBody class="[&_td]:whitespace-normal [&_td]:py-2.5">
    <TableRow><TableCell class="font-bold">Safe</TableCell><TableCell>yes</TableCell><TableCell class="font-bold text-primary">yes</TableCell><TableCell>potentially no</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Idempotent</TableCell><TableCell>yes</TableCell><TableCell class="font-bold text-primary">yes</TableCell><TableCell>potentially no</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">URI for the query</TableCell><TableCell>yes, by definition</TableCell><TableCell>optional (Location)</TableCell><TableCell>no</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">URI for the result</TableCell><TableCell colspan="3">optional for all three (Content-Location)</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Cacheable</TableCell><TableCell>yes</TableCell><TableCell class="font-bold text-primary">yes</TableCell><TableCell>only for a later GET or HEAD</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Request content</TableCell><TableCell>no defined meaning</TableCell><TableCell>expected</TableCell><TableCell>expected</TableCell></TableRow>
  </TableBody>
</Table>

<p class="caption mt-3">IANA registers QUERY as safe and idempotent <Cite r="10008" s="5.1" /></p>

<!--
⏱ 0:35 (ends 8:45) · Sources: RFC 10008 §1 (Table 1), §5.1

SAY: This is Table 1 of RFC 10008. QUERY is safe and idempotent, the same as GET. Thus caches and automatic retries can work. A QUERY has a URI for the query only if the server gives one in Location. Caches can keep its responses for later QUERY requests. POST responses are different: a cache can use them only for a later GET. And QUERY expects content, the same as POST.

CLARIFY: "Potentially no" is the wording of the RFC. One POST endpoint can be harmless, but the method promises nothing.

NEXT → A full QUERY request.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import req from './snippets/contacts-query.http?raw'
</script>

# A QUERY request (RFC 10008 Appendix A.1)

<div class="grid grid-cols-[minmax(0,1fr)_420px] gap-6">
  <Snippet :code="req" lang="http" title="request" dense wrap :callouts="{ 1: '1', 3: '2', 6: '3' }" />
  <ul class="legend-v">
    <li><Badge>1</Badge><span><b>QUERY and the target.</b> The target resource sets the scope of the query <Cite r="10008" s="2" /></span></li>
    <li><Badge>2</Badge><span><b>Content-Type is mandatory.</b> If it is missing or wrong, the server must reject the request. It must not guess the type <Cite r="10008" s="2.1" /></span></li>
    <li><Badge>3</Badge><span><b>The query content.</b> Here it is form-encoded. The RFC also shows JSON, SQL, JSONPath and XSLT.</span></li>
  </ul>
</div>

<!--
⏱ 0:40 (ends 9:25) · Sources: RFC 10008 §2, §2.1, Appendix A.1, A.6

SAY: This is the example from the RFC. Item one is QUERY and the target, /contacts. The target resource sets the scope of the query.

Item two is Content-Type. If it is missing, or if it does not agree with the content, the server must reject the request. The server must not guess the type from the content.

Item three is the query content. Here it is form-encoded: select these fields, limit ten, and find emails at example. Other examples in the RFC use JSON, SQL, JSONPath and XSLT.

NEXT → The response, and the two URIs that it can give.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import res from './snippets/contacts-response.http?raw'
</script>

# A QUERY response (RFC 10008 Appendix A.4)

<div class="grid grid-cols-[minmax(0,1fr)_400px] gap-6">
  <div class="flex flex-col gap-3">
    <Snippet :code="res" lang="http" title="response" dense wrap :callouts="{ 3: '1', 4: '2' }" />
    <Alert class="border-2 border-destructive py-2">
      <AlertDescription class="text-base text-foreground">If the query is sensitive, these URIs <b>should not</b> contain it <Cite r="10008" s="4" /></AlertDescription>
    </Alert>
  </div>
  <ul class="legend-v">
    <li><Badge>1</Badge><span><b>Content-Location.</b> A GET to this URI gets <i>this result</i> again <Cite r="10008" s="2.3" /></span></li>
    <li><Badge>2</Badge><span><b>Location.</b> A GET to this URI <i>runs the query</i> again, with no content <Cite r="10008" s="2.4" /></span></li>
    <li><Badge variant="outline">→</Badge><span><b>Redirects.</b> 301, 302, 307 and 308 keep QUERY. 303 changes it to GET <Cite r="10008" s="2.5" /></span></li>
    <li><Badge variant="outline">✓</Badge><span><b>Conditional requests</b> work as for GET, so 304 is possible <Cite r="10008" s="2.6" /></span></li>
  </ul>
</div>

<!--
⏱ 0:55 (ends 10:20) · Sources: RFC 10008 §2.3–2.6, §4, Appendix A.4

SAY: Now the response. Item one, Content-Location, points to a stored copy of this result. Item two, Location, points to a stored version of the query itself. A later plain GET to that URI runs the query again, with no body. Thus QUERY gets back the main advantage of GET: an important resource gets a URI.

Redirects 301, 302, 307 and 308 keep the QUERY method. The old browser rule that changes POST to GET does not apply. 303 tells the client to change to GET. Conditional requests work as for GET, so 304 is possible.

The red box is from the security section. If the query is sensitive, these new URIs should not contain it. If they do, the data goes back into the logs.

NEXT → How to send a QUERY request.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import curl from './snippets/client.sh?raw'
import fetchJs from './snippets/client.mjs?raw'
</script>

# Send a QUERY request: curl and fetch()

<div class="grid grid-cols-[400px_minmax(0,1fr)] gap-5">
  <div class="flex flex-col gap-2">
    <Snippet :code="curl" lang="bash" title="client.sh" size="sm" dense />
    <Terminal title="output" size="sm" class="leading-snug">
      <div class="ln">HTTP/1.1 200 OK</div>
      <div class="ln">Location: /contacts/stored-queries/1</div>
      <div class="ln">Content-Type: application/json</div>
      <div class="ln"> </div>
      <div class="ln">[{"surname":"Smith","givenname":"John",</div>
      <div class="ln">  "email":"smith@example.org"}]</div>
    </Terminal>
  </div>
  <div class="flex flex-col gap-2">
    <Snippet :code="fetchJs" lang="js" title="client.mjs (browser, or Node 24)" size="sm" dense lines="3" />
    <Terminal title="node client.mjs" size="sm">
      <div class="ln">200 /contacts/stored-queries/2</div>
    </Terminal>
    <Alert class="border-2 border-destructive py-2">
      <AlertTitle class="text-lg font-bold text-destructive">Method names are case-sensitive</AlertTitle>
      <AlertDescription class="text-base text-foreground">fetch() changes only DELETE, GET, HEAD, OPTIONS, POST and PUT to upper case <Cite t="Fetch" href="https://fetch.spec.whatwg.org/#concept-method-normalize" />. With <code>method: 'query'</code> it sends <code>query</code>, and the Node 24 server replied <b>400</b>.</AlertDescription>
    </Alert>
  </div>
</div>

<!--
⏱ 0:50 (ends 11:10) · Sources: RFC 10008 §3, Appendix A.2, A.3; RFC 9110 §9.1; WHATWG Fetch (method normalize); tested on macOS, Node 24.18, curl 8.7.1, 17 Oct 2026

SAY: A client does not have to use new software. curl sends any method with -X. On the left is the command and its real output from the server on the next slide. The output is 200, a Location for the stored query, and the matching contact.

fetch() works in the browser and in Node. The real output from the same server is below it. The red box is a trap. Method names are case-sensitive, and fetch changes only the six classic names to upper case. If you write 'query' in lower case, fetch sends lower-case "query". When I did this, the Node server replied 400.

CLARIFY: Python also works: urllib.request.Request(url, method="QUERY", data=..., headers=...). The study guide has it.

NEXT → The server side.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import server from './snippets/server.mjs?raw'
</script>

# A server that follows RFC 10008

<div class="grid grid-cols-[minmax(0,1fr)_280px] gap-4">
  <Snippet :code="server" lang="js" title="server.mjs (the handler)" range="14-34" numbers size="sm" dense :font="12" lines="22-25,27-30" />
  <ul class="bul big">
    <li><b>Lines 15–20</b>: OPTIONS, a GET to a stored query, and 405 for other methods</li>
    <li><b>Lines 22–30</b>: the checks of <Cite r="10008" s="2.1" /> (highlighted)</li>
    <li><b>Lines 31–33</b>: keep the query, and send its URI in Location</li>
  </ul>
</div>

<!--
⏱ 0:50 (ends 12:00) · Sources: RFC 10008 §2, §2.1, §2.2, §2.4, Appendix A.2

SAY: This is the server that I used to test the clients. It is plain Node, with no framework. Lines 15 to 20 route the request. OPTIONS replies with Allow and Accept-Query. A GET to a stored-query URI runs that query again. Any other method gets 405 with Allow.

The highlighted lines are section 2.1 of the RFC, in code. There are four checks: Content-Type missing, Content-Type not supported, content that is not valid JSON, and a valid query that the server cannot run. The next slide gives the status codes.

Then the server keeps the query and returns its URI in Location. This is the "equivalent resource" of section 2.2.

CLARIFY: readBody limits the body to 16 KiB. search limits the results to 100. A safe method must also have limits. A body that is too large gets 400 here; 413 is a better status, and the study guide shows the change.

NEXT → The status codes.
-->

---
section: 4. Description
frame: desc
---

# Status codes for a QUERY request

<Table class="text-lg">
  <TableHeader><TableRow class="border-b-2"><TableHead class="h-9">Condition</TableHead><TableHead class="w-[330px]">Status</TableHead><TableHead class="w-[210px]">Source</TableHead></TableRow></TableHeader>
  <TableBody class="[&_td]:whitespace-normal [&_td]:py-1.5">
    <TableRow><TableCell>OPTIONS request (discovery)</TableCell><TableCell><b>204</b> with Allow, Accept-Query</TableCell><TableCell><Cite t="RFC 10008 App. A.2" href="https://www.rfc-editor.org/rfc/rfc10008.html#appendix-A.2" /></TableCell></TableRow>
    <TableRow><TableCell>Content-Type is missing</TableCell><TableCell><b>400</b></TableCell><TableCell><Cite r="10008" s="2.1" /></TableCell></TableRow>
    <TableRow><TableCell>Media type is not supported</TableCell><TableCell><b>415</b> with Accept-Query</TableCell><TableCell><Cite r="10008" s="2.1" /></TableCell></TableRow>
    <TableRow><TableCell>Content does not agree with the type</TableCell><TableCell><b>400</b>; do not guess the type</TableCell><TableCell><Cite r="10008" s="2.1" /></TableCell></TableRow>
    <TableRow><TableCell>Valid query that the server cannot run</TableCell><TableCell><b>422</b></TableCell><TableCell><Cite r="10008" s="2.1" /></TableCell></TableRow>
    <TableRow><TableCell>Method not allowed on this resource</TableCell><TableCell><b>405</b> with Allow</TableCell><TableCell><Cite r="9110" s="15.5.6" /></TableCell></TableRow>
    <TableRow class="text-muted-foreground"><TableCell>Accept value is not supported</TableCell><TableCell><b>406</b></TableCell><TableCell><Cite r="10008" s="2.1" /></TableCell></TableRow>
    <TableRow class="text-muted-foreground"><TableCell>Method is not known to the server</TableCell><TableCell><b>501</b></TableCell><TableCell><Cite r="9110" s="9.1" /></TableCell></TableRow>
  </TableBody>
</Table>

<p class="caption mt-2">The first six rows were tested with curl against <code>server.mjs</code>. The last two rows are from the RFCs only.</p>

<!--
⏱ 0:45 (ends 12:45) · Sources: RFC 10008 §2.1, Appendix A.2; RFC 9110 §9.1, §15.5.6; tested with curl 8.7.1, 17 Oct 2026

SAY: This table is the summary of the status codes. I tested the first six rows with curl against the server. A missing Content-Type gives 400. An unsupported type gives 415, with Accept-Query to tell the client the supported types. Content that does not agree with its type gives 400. The server must not guess the type. A valid query that the server cannot run gives 422.

The last two rows are from the RFCs only. My server does not check Accept. And for a method name that it does not know, Node replies 400, not 501.

NEXT → Safe does not mean secure.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import handler from './snippets/search-handler.js?raw'
</script>

# Safe is not the same as secure

<Alert class="mb-3 py-2">
  <AlertDescription class="text-lg text-foreground"><b>Safe</b> and <b>idempotent</b> describe what the client intends. Safety “does not prevent an implementation from including behavior that is potentially harmful” <Cite r="9110" s="9.2.1" />.</AlertDescription>
</Alert>

<div class="grid grid-cols-[minmax(0,1fr)_300px] gap-4">
  <Snippet :code="handler" lang="js" title="search-handler.js (excerpt)" size="sm" dense :font="12.5" removed="6" added="7-8" lines="3,5" class="self-start" />
  <ul class="bul risks">
    <li><b>Injection</b>: the query content is untrusted input (SQL, NoSQL, LDAP, search languages)</li>
    <li><b>Broken authorization</b>: read-only does not mean allowed</li>
    <li><b>Resource exhaustion</b>: deep or large queries <Cite t="Cha et al., 2020" href="https://doi.org/10.1145/3368089.3409670" /></li>
    <li><b>Information disclosure</b>: results that the caller must not see</li>
    <li><b>Automated repetition</b>: clients repeat safe requests, and so do scrapers</li>
  </ul>
</div>

<!--
⏱ 1:00 (ends 13:45) · Sources: RFC 9110 §9.2.1, §9.2.2; Cha et al. 2020; Hartig & Pérez 2018

SAY: This is the most important security point of the talk. Safe and idempotent describe what the client intends. They do not protect the server. The quote at the top is from RFC 9110.

The code is a user search for administrators. The red line puts the query content directly into the SQL text. This is classic injection, and the move from the URI to the body changes nothing. The green lines send the value as a parameter, with a timeout.

The highlighted lines are two more defences. Line 3 checks authorization, because a search of users by email is sensitive. Line 5 limits the results, because a safe query can still be expensive.

The list on the right is the summary. Note the last item: clients repeat idempotent requests by design, so rate limits are still necessary.

NEXT → Caches bring their own risk.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import cacheKey from './snippets/cache-key.mjs?raw'
import cacheOut from './snippets/cache-key.out?raw'
</script>

# QUERY in a cache: the key must include the content

<div class="grid grid-cols-[minmax(0,1fr)_320px] gap-3">
  <Snippet :code="cacheKey" lang="js" title="cache-key.mjs" size="sm" dense :font="12" lines="7-10" />
  <div class="flex flex-col gap-3">
    <Terminal title="node cache-key.mjs" size="sm" :font="12.5" :text="cacheOut" />
    <ul class="bul rules">
      <li>The key <b>must</b> include the content and its metadata <Cite r="10008" s="2.7" /></li>
      <li>Caches <b>can</b> normalise the content. A wrong normalisation gives the wrong response <Cite r="10008" s="4" /></li>
      <li>Many caches use only the method and the URI as the key <Cite r="9111" s="2" /></li>
      <li>When the cache and the origin disagree, attackers win <Cite t="Nguyen 2019" href="https://doi.org/10.1145/3319535.3354215" /> <Cite t="Mirheidari 2020" href="https://www.usenix.org/conference/usenixsecurity20/presentation/mirheidari" /></li>
    </ul>
  </div>
</div>

<!--
⏱ 1:10 (ends 14:55) · Sources: RFC 10008 §2.7, §4, Appendix A.5; RFC 9111 §2; Nguyen et al. 2019; Mirheidari et al. 2020

SAY: Caches can keep QUERY responses. This is an advantage, and also the largest new attack surface. RFC 10008 says that the cache key must include the request content and its metadata, for example Content-Type. Thus a cache must read the full body before it can find the key.

The code shows the problem, and it runs. It has two normalisers. "canonical" sorts the keys. This is allowed, because the meaning does not change. "lossy" keeps only the fields that the cache knows, so "role" is lost. The output is at the top right. canonical gives two keys. lossy gives one key for an admin query and a user query. Thus a normal user can get the admin results. This is a data leak.

The rules on the right: normalisation is allowed, but a wrong one gives wrong responses. And the cache papers show that attackers use any disagreement between the cache and the origin.

CLARIFY: I do not say that a specific CDN does this. QUERY caching is new code, and new code has these bugs. A server can also send Location. Then clients use a plain GET, and caches handle GET well.

NEXT → Browsers, and CORS.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import preflight from './snippets/preflight.http?raw'
</script>

# QUERY from a browser: the CORS preflight

<div class="grid grid-cols-[minmax(0,1fr)_380px] gap-5">
  <Snippet :code="preflight" lang="http" title="preflight (browser → server, server → browser)" size="sm" dense lines="4,9,11" />
  <ul class="bul cors">
    <li>A cross-origin QUERY <b>always</b> has a preflight. Only GET, HEAD and POST are CORS-safelisted <Cite t="Fetch" href="https://fetch.spec.whatwg.org/#methods" /> <Cite r="10008" s="4" /></li>
    <li>Same-origin requests, curl and service calls have no preflight</li>
    <li>HTML forms send only GET or POST, and <code>no-cors</code> rejects QUERY. Another site cannot send it <b>without server permission</b></li>
    <li>JavaScript can read <code>Location</code> only if the server exposes it (line 11)</li>
    <li>A permissive policy with credentials can still leak results <Cite t="Chen et al., 2018" href="https://www.usenix.org/conference/usenixsecurity18/presentation/chen-jianjun" /></li>
  </ul>
</div>

<!--
⏱ 0:55 (ends 15:50) · Sources: WHATWG Fetch (methods, CORS protocol); WHATWG HTML (form method); RFC 10008 §4; Chen et al. 2018

SAY: JavaScript on app.example wants to send QUERY to api.example. First, the browser sends this OPTIONS request. Line 4 asks: is QUERY allowed from this origin? The browser must ask, because only GET, HEAD and POST are CORS-safelisted methods. The server allows QUERY on line 9, and the browser keeps that answer for Max-Age seconds.

Line 11 is easy to miss. JavaScript cannot read Location unless the server exposes it.

The security result: forms send only GET or POST, and the no-cors mode rejects other methods. Thus a malicious page cannot send QUERY to your API without your permission. This is stronger than POST. But Chen and colleagues found that CORS is often configured incorrectly. A permissive policy with credentials can still leak QUERY results.

NEXT → Integrity between services.
-->

---
section: 4. Description
frame: desc
---

<script setup>
import signed from './snippets/signed-query.http?raw'
</script>

# Sign a QUERY request (RFC 9421)

<Snippet :code="signed" lang="http" title="signed request (Content-Digest of the content shown)" size="sm" dense wrap lines="4,5" />

<div class="mt-3 grid grid-cols-[440px_1fr] gap-5">
  <Table class="text-base">
    <TableHeader><TableRow class="border-b-2"><TableHead>Component</TableHead><TableHead>Value in a QUERY</TableHead></TableRow></TableHeader>
    <TableBody class="[&_td]:py-1">
      <TableRow><TableCell class="font-mono font-bold">@method</TableCell><TableCell>QUERY</TableCell></TableRow>
      <TableRow><TableCell class="font-mono font-bold">@target-uri</TableCell><TableCell>https://api.example/contacts</TableCell></TableRow>
      <TableRow><TableCell class="font-mono font-bold">@query</TableCell><TableCell class="text-destructive">only <code>?</code> <Cite r="9421" s="2.2.7" /></TableCell></TableRow>
      <TableRow><TableCell class="font-mono font-bold">content-digest</TableCell><TableCell>the query itself <Cite r="9530" /></TableCell></TableRow>
    </TableBody>
  </Table>
  <ul class="bul sig">
    <li>The signature does <b>not</b> cover the content. Sign <code>content-digest</code>, and calculate it again <Cite r="9421" s="7.2.8" /></li>
    <li>Some frameworks merge URI and form parameters. An unsigned one can replace a signed one <Cite r="9421" s="7.5.8" /></li>
    <li>A signature gives integrity and origin. It does not give authorization or confidentiality</li>
  </ul>
</div>

<!--
⏱ 1:00 (ends 16:50) · Sources: RFC 9421 §1, §2.2.7, §7.2.8, §7.5.8; RFC 9530

SAY: RFC 9421 lets one service sign parts of a request, so that another service can find any change. Line 5 lists the signed parts: the method, the target URI, the content type and the content digest. Line 4 is a real Content-Digest: the SHA-256 of the body below it.

The table shows the trap. For a GET, a signature on @query protects the search terms. A QUERY has no URI query, so @query is only a question mark. A GET signing policy, copied with no change, covers everything except the query. Thus sign Content-Digest, and the receiver must calculate it again over the bytes that it got. Section 7.5.8 also warns about frameworks that merge URI and form parameters. And a signature gives integrity, not authorization.

NEXT → All the layers together.
-->

---
section: 4. Description
frame: desc
---

# Deploy QUERY: all hops must support it

<Table class="deploy text-base">
  <TableHeader><TableRow class="border-b-2"><TableHead class="w-[170px]">Hop</TableHead><TableHead>Must do for QUERY</TableHead><TableHead class="w-[300px]">If it does not</TableHead></TableRow></TableHeader>
  <TableBody class="[&_td]:whitespace-normal [&_td]:py-2">
    <TableRow><TableCell class="font-bold">Browser, client</TableCell><TableCell>preflight; upper-case <code>QUERY</code>; exposed headers</TableCell><TableCell>request blocked, or sent as <code>query</code></TableCell></TableRow>
    <TableRow><TableCell class="font-bold">CDN, cache</TableCell><TableCell>key on method, URI, content and type; correct normalisation</TableCell><TableCell>wrong or poisoned responses</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">WAF</TableCell><TableCell>allow it; examine its body as a POST body; size limits</TableCell><TableCell>a change of method avoids the rules <Cite t="OWASP WSTG-CONF-06" href="https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/06-Test_HTTP_Methods" /></TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Load balancer, proxy</TableCell><TableCell>forward it; frame the body the same way as the next hop</TableCell><TableCell>405 or 501, or request smuggling <Cite t="Jabiyev 2021" href="https://doi.org/10.1145/3460120.3485384" /></TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Framework, app</TableCell><TableCell>route it; strict Content-Type; authorization, validation, cost limits</TableCell><TableCell>415 / 422 gaps, injection, DoS</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Database</TableCell><TableCell>parameterised queries, timeouts, result limits</TableCell><TableCell>injection, exhaustion</TableCell></TableRow>
    <TableRow><TableCell class="font-bold">Logs, SIEM, docs</TableCell><TableCell>parse the method; no raw sensitive bodies; OpenAPI 3.2 has <code>query</code> <Cite t="OAS 3.2" href="https://spec.openapis.org/oas/v3.2.0.html" /></TableCell><TableCell>gaps in monitoring</TableCell></TableRow>
  </TableBody>
</Table>

<!--
⏱ 0:55 (ends 17:45) · Sources: RFC 10008 §2.1, §2.7, §4; Fetch; RFC 9112 §6; RFC 9110 §9.1; Jabiyev et al. 2021; OWASP WSTG-CONF-06; OpenAPI 3.2.0

SAY: An RFC is one thing. A working production path is a different thing. Read this table from top to bottom, as the request moves. The browser must send the preflight and use the upper-case name. The cache must put the content in the key. The WAF must allow QUERY and examine its body as a POST body. If not, an attacker changes the method to avoid the rules. OWASP tests exactly this. Load balancers and proxies must forward QUERY and frame the body in the same way. If not, you get 405, 501 or request smuggling. The application must have a strict Content-Type, authorization, validation and cost limits. The database must use parameterised queries. And the log parsers must know the method. OpenAPI 3.2 already has a "query" operation.

NOTICE: Little of this is new. The new part is that every layer must know QUERY and treat its body correctly. One hop with no support breaks it. One hop that lets it through without the POST controls makes it a bypass.

NEXT → Conclusion.
-->

---
section: Conclusion
frame: concl
---

<div class="grid grid-cols-3 gap-3">
  <Card class="gap-2 py-3">
    <CardHeader class="px-3"><CardTitle><M t="GET" /></CardTitle><CardDescription class="text-lg font-bold text-destructive">Get a resource by its URI</CardDescription></CardHeader>
    <CardContent class="px-3"><ul class="bul tight"><li>the query fits in a URI</li><li>links and caches are important</li></ul></CardContent>
  </Card>
  <Card class="gap-2 border-2 border-primary py-3">
    <CardHeader class="px-3"><CardTitle><M t="QUERY" /></CardTitle><CardDescription class="text-lg font-bold text-destructive">Safe query with content</CardDescription></CardHeader>
    <CardContent class="px-3"><ul class="bul tight"><li>the operation <i>is</i> a query</li><li>the input is large or structured</li><li>all hops support it</li></ul></CardContent>
  </Card>
  <Card class="gap-2 py-3">
    <CardHeader class="px-3"><CardTitle><M t="POST" /></CardTitle><CardDescription class="text-lg font-bold text-destructive">General processing</CardDescription></CardHeader>
    <CardContent class="px-3"><ul class="bul tight"><li>the operation is not safe</li><li>it changes data or submits a form</li></ul></CardContent>
  </Card>
</div>
<ul class="bul take">
  <li><b>QUERY does not replace GET or POST.</b> It fills one gap: safe, idempotent queries with request content.</li>
  <li>Its security depends on how clients, caches, WAFs, gateways, applications and logs <b>implement</b> it. The method alone gives no security.</li>
</ul>

<!--
⏱ 0:45 (ends 18:30)

SAY: To conclude, no method wins. Use GET when the query fits in a URI and links and mature caches are important. Use QUERY when the operation is really a safe query with large or structured input, and all hops support it. Use POST when the operation is not safe.

Two points to remember. QUERY does not replace the other methods. It fills one gap. And the method alone gives no security. Its value depends on how each layer implements it. Thus security teams must be part of the adoption from the start.

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

Possible questions and short answers:

• "Why not send a body with GET?" RFC 9110 §9.3.1: content in a GET request has no defined meaning, and some implementations reject it. This gives a risk of request smuggling. RFC 9205 §4.5.1 says the same about generic HTTP software.

• "Why a new method, and not SEARCH, REPORT or PROPFIND?" RFC 10008 Appendix B: those come from WebDAV, and they use a generic XML media type. "QUERY" also maps to the query component of the URI. Early drafts used SEARCH.

• "Is QUERY more secure than GET?" Not by itself. It keeps the input out of URIs. But systems can log bodies, the cache key becomes more difficult, and every hop must support it.

• "Can browsers send it?" Yes, with fetch(). A cross-origin request always has a preflight. HTML forms cannot send it.

• "Does QUERY help against CSRF?" It is safe, so it must not change state. A cross-site page cannot send it without a preflight. But a permissive CORS policy can still leak the results.

• "Did you run the code?" Yes: server.mjs, curl, fetch and Python urllib on Node 24.18, curl 8.7.1 and Python 3.14, on 17 Oct 2026. The cache-key output is from a real run.
-->

---
layout: thank-you
---
