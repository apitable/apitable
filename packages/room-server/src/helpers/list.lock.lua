local addKey = {}
for _, v in ipairs(KEYS) do
  if (redis.call('SET', v, ARGV[1], 'NX', 'EX', ARGV[2])) then
    addKey[#addKey + 1] = v
  else
    if (#addKey > 0) then
      redis.call('DEL', unpack(addKey))
    end
    return { 0, addKey }
  end
end
return { 1, addKey }
