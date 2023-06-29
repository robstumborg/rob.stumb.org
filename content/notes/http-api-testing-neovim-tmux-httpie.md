---
title: "http api testing with neovim + tmux + httpie"
date: "2023-04-14"
---

tl;dr [demo video](#demo)

## intro

if you build stuff for the internet, you're likely familiar with http api
testing tools such as postman or insomnia. these tools are great and offer a
lot of convenience for quickly designing and testing endpoints. however, as
someone who enjoys working in a terminal, i wanted to come up w/ an alternative
more suited to my workflow.

i've been using [neovim] as my primary editor for years now, and i've combined
it w/ [tmux] to create a tailored ide experience, which i've been really happy
with for a long time.

for http api testing, i came up with a solution of combining the following tools:

- [neovim] + [vimux plugin]
- [tmux]
- [httpie]

## the setup

in [neovim], i configure keymaps which use the [vimux plugin] to execute
commands in an adjacent tmux pane directly from neovim:

```
<leader>ts - send current visual selection as command to execute in tmux pane
<leader>tl - send current line as command to execute in tmux pane
```

here's how they're implemented in my `init.lua`:

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

[httpie] allows you to save authentication tokens, custom headers, and other
data to a "session" file, which is similar to how postman/insomnia allow you to
save endpoints, auth tokens, and other data for a given api. you can read more
about how to use httpie sessions using [their documentation](https://httpie.io/docs/cli/sessions).

i'll typically send an initial request using httpie which includes an
authentication token and the `--session=session-name` flag, and then i can
continue using that session name w/ httpie to quickly send authorized requests
to the same api. i'll also use the `--json` flag to let the api know that i'd
prefer a json response. this simply tells httpie to send along the `Accept:
application/json` header with the request, and it will save that header to the
session file for future requests.

example command for sending an initial request to an api endpoint:

```sh
http fakestoreapi.com/products -A bearer -a tldguhropbgchxnmhznu8iwhnlks8qlttbdf7dgg --session=fakestore --json
```

## workflow

httpie will now have a session named 'fakestore' stored in it's config
directory (`~/.config/httpie` on linux) with your auth token. now i can use
that session to send authorized requests to that api.

now i'll create a file to document some endpoints. i typically create a file
named `endpoints.md` in a given project directory, and then i'll write httpie
commands for each endpoint. i've found writing httpie commands is faster than
clicking around in a gui tool like postman/insomnia. [their
documentation](https://httpie.io/docs/cli) is great, so it's simple to quickly
look up the flags you need to send along w/ a given request.

here's an example of an `endpoints.md` file i've created for fakestoreapi.com

```md
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

now i can send requests to these endpoints by navigating to it in my endpoints
buffer and pressing `<leader>tl` to execute that line as a command in my shell.
i can also do a visual selection and press `<leader>ts` to send the current
visual selection to tmux, in case a given command is particularly long and it
makes sense to have it spanning multiple lines.

now i'm quickly sending authorized requests straight from neovim and inspecting
the results in the adjacent tmux pane. awesome!

## demo

here's a short screen capture of me using this workflow:

{{< video src="/vid/neovim-http-api-testing.mp4" >}}

i'll continue to tweak this workflow as i use it more, but so far i like it much
better than clicking around the interfaces of gui tools like postman/insomnia. i
hope this is helpful to someone else out there who prefers to work in a terminal
but wants a way to modernize their api testing workflow.

if you have any thoughts on how to to improve this, please let me know.

have fun!

[httpie]: https://httpie.io/
[neovim]: https://neovim.io/
[tmux]: https://github.com/tmux/tmux
[vimux plugin]: https://github.com/preservim/vimux
