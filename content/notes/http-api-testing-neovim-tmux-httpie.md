---
title: "HTTP API testing with Neovim + tmux + HTTPie"
date: "2023-04-14"
---

tl;dr [demo video](#demo)

## Intro

If you build stuff for the internet, you're likely familiar with HTTP API testing tools such as
[PostMan](https://www.postman.com) or [Insomnia](https://www.insomnia.rest). These tools are great and offer a lot of
convenience for quickly designing and testing endpoints. However, as someone who enjoys working in a terminal, I wanted
to come up with an alternative more suited to my workflow.

I've been using [Neovim] as my primary editor for years now, and I've combined
it with [tmux] to create a tailored IDE experience, which I've been really happy
with for a long time.

For HTTP API testing, I came up with the solution of combining the following tools:

- [Neovim] + [Vimux plugin]
- [tmux]
- [HTTPie]

## The setup

In [Neovim], I configure keymaps which use the [Vimux plugin] to execute
commands in an adjacent tmux pane directly from Neovim:

```
<leader>ts - send current visual selection as command to execute in tmux pane
<leader>tl - send current line as command to execute in tmux pane
```

Here's how they're implemented in my `init.lua`:

```lua
-- send current visual selection as command to execute in tmux pane
vim.cmd([[
vn <silent> <leader>ts :<C-U>VimuxRunCommand(VisualSelection())<cr>
function! VisualSelection()
  let [line_start, column_start] = getpos("'<")[1:2]
  let [line_end, column_end] = getpos("'>")[1:2]
  let lines = getline(line_start, line_end)
  if len(lines) == 0
    return ''
  endif
  let lines[-1] = lines[-1][: column_end - (&selection == 'inclusive' ? 1 : 2)]
  let lines[0] = lines[0][column_start - 1:]
  return join(lines, "\n")
endfunction]])

-- send current line as command to execute in tmux pane
vim.keymap.set("n", "<leader>tl", function()
	local line = vim.fn.getline(".")
	vim.cmd("VimuxRunCommand '" .. line .. "'")
end)
```

[HTTPie] allows you to save authentication tokens, custom headers, and other
data to a "session" file, which is similar to how postman/insomnia allow you to
save endpoints, auth tokens, and other data for a given api. You can read more
about how to use HTTPie sessions using [their documentation](https://HTTPie.io/docs/cli/sessions).

I'll typically send an initial request using HTTPie which includes an
authentication token and the `--session=session-name` flag, and then I can
continue using that session name with HTTPie to quickly send authorized requests
to the same api. I'll also use the `--json` flag to let the api know that i'd
prefer a json response. this simply tells HTTPie to send along the `Accept:
application/json` header with the request, and it will save that header to the
session file for future requests.

Example command for sending an initial request to an API endpoint:

```sh
http fakestoreapi.com/products -A bearer -a tldguhropbgchxnmhznu8iwhnlks8qlttbdf7dgg --session=fakestore --json
```

## workflow

HTTPie will now have a session named 'fakestore' stored in it's config
directory (`~/.config/HTTPie` on linux) with your auth token. now I can use
that session to send authorized requests to that api.

Now I'll create a file to document some endpoints. I typically create a file
named `endpoints.md` in a given project directory, and then I'll write HTTPie
commands for each endpoint. i've found writing HTTPie commands is faster than
clicking around in a gui tool like postman/insomnia. [their
documentation](https://HTTPie.io/docs/cli) is great, so it's simple to quickly
look up the flags you need to send along with a given request.

Here's an example of an `endpoints.md` file I've created for fakestoreapi.com

```shell
# fakestoreapi.com

## login
http --session=fakestore \
    --form post fakestoreapi.com/auth/login \
    username=mor_2314 \
    password=83r5^_ 

## get /products - all products
http fakestoreapi.com/products --session=fakestore

## get /products/{id} - single product
http fakestoreapi.com/products/5 --session=fakestore

## get /products/categories - list favorites
http fakestoreapi.com/products/categories --session=fakestore

## get /users - get all users
http fakestoreapi.com/users --session=fakestore

## post /products - add product
http --session=fakestore \
    --form post fakestoreapi.com/products \
    title="test product" \
    price=1000 \
    description="test description" \
    category="electronics" \
    image="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
    

## delete /products/{id} - delete product from favorites
http delete fakestoreapi.com/products/6 --session=fakestore
```

Now I can send requests to these endpoints by navigating to it in my endpoints
buffer and pressing `<leader>tl` to execute that line as a command in my shell.
i can also do a visual selection and press `<leader>ts` to send the current
visual selection to tmux, in case a given command is particularly long and it
makes sense to have it spanning multiple lines.

Now I'm quickly sending authorized requests straight from Neovim and inspecting
the results in the adjacent tmux pane. Awesome!

## demo

Here's a short screen capture of me using this workflow:

{{< video src="/vid/Neovim-http-api-testing.mp4" >}}

I'll continue to tweak this workflow as I use it more, but so far I like it much
better than clicking around the interfaces of GUI tools like PostMan/Insomnia. I
hope this is helpful to someone else out there who prefers to work in a terminal
but wants a way to modernize their API testing workflow.

If you have any thoughts on how to to improve this, please let me know.

Have fun!

[HTTPie]: https://httpie.io/
[Neovim]: https://neovim.io/
[tmux]: https://github.com/tmux/tmux
[Vimux plugin]: https://github.com/preservim/vimux
