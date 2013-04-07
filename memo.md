rsync -avn -C -e "ssh -p 60222" /Users/cuccpkfs/dev/project/sms/node_sms/ node@noradle.com:node-sms/

SMG 对于来自 SP 的连接的速率控制是针对每个连接的，
而一个 SP 最多可以开若干个到同一 SMG server 的连接。
这样，SuperQueue 的速率控制要针对每个连接，这个就比较困难了。

可能需要在连接的时候启动控制，每个 resource 上面附带这一组 limiter。
其实就是每个 resource 拥有一个独立的 queue。
但是当 queue 还有内容，但是 resource 关闭了后，器 queue 应该归为全局的 queue。
因此 queue 还是应该是全局的，但是 limiter 是针对每个 resource 的。

如果需要并发多个连接发送短信，就需要启动多个 SP 实例，
到来的短信依次分配给不同的的 SP 实例好了。

