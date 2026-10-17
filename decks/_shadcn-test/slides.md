---
theme: none
title: shadcn test
addons:
  - shadcn
---

<script setup>
import req from './snippets/query.http?raw'
import server from './snippets/server.mjs?raw'
</script>

<div class="grid grid-cols-2 gap-4 p-6">
<Card>
  <CardHeader><CardTitle>Card title</CardTitle><CardDescription>Description text</CardDescription></CardHeader>
  <CardContent class="flex gap-2"><Badge>default</Badge><Badge variant="secondary">secondary</Badge><Badge variant="destructive">destructive</Badge><Badge variant="outline">outline</Badge><Kbd>Ctrl</Kbd></CardContent>
</Card>
<Alert variant="destructive"><AlertTitle>Safe ≠ secure</AlertTitle><AlertDescription>Body text of alert</AlertDescription></Alert>
<Snippet :code="req" lang="http" title="query.http" lines="1,3" :callouts="{1: '1', 6: '2'}" />
<Table><TableHeader><TableRow><TableHead>Method</TableHead><TableHead>Safe</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>GET</TableCell><TableCell>yes</TableCell></TableRow><TableRow><TableCell>QUERY</TableCell><TableCell>yes</TableCell></TableRow></TableBody></Table>
</div>

---

<script setup>
import server from './snippets/server.mjs?raw'
</script>

<div class="p-4 h-full">
<Snippet :code="server" lang="js" title="server.mjs" numbers size="sm" :steps="[{ lines: '3-6', label: 'read the body' }, { lines: '14-20', label: 'content type' }]" />
</div>
