curl -i -X QUERY localhost:8787/contacts \
  -H 'Content-Type: application/json' \
  --data '{"q":"example.org","limit":10}'
