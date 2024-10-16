<script lang="ts">
// @ts-nocheck

export default {
  data() {
    return {
      inputValue: '',

      selectedSuggestionIndex: null,
      suggestions: [],

      commands: [
        {
          slash: '/chat',
          parameters: ['chatName'],
          suggestions: async (chatName) => {
            if (chatName === undefined)
              return []

            function selectChat(chat) {
              alert(`Chat ${chat.id} selected`)
            }

            return (await this.getChats(chatName))
              .map(chat => ({
                text: chat.channelName,
                onEnter: () => selectChat(chat)
              }))
          }
        }
      ]
    }
  },
  methods: {
    getChats: async (query) => {
      return new Promise((resolve) => setTimeout(() => resolve(
        [...new Array(100)]
          .map((_, index) => ({ id: index, channelName: `Channel ${index}` }))
          .filter(chat => chat.channelName.includes(query))
      ), 1000))
    },

    onInput() {
      if (!this.inputValue.startsWith('/')) {
        this.suggestions = []
        return
      }

      const filteredCommand = this.commands.find(command => this.inputValue.startsWith(command.slash))

      if (!filteredCommand) {
        this.suggestions = this.commands.map(command => ({
          text: command.slash,
          onEnter: () => {
            this.inputValue = command.slash + " "
            this.onInput()
          }
        }))
      }

      const [_, ...parameters] = this.inputValue.split(' ')

      filteredCommand.suggestions(...parameters)
        .then(suggestions => this.suggestions = suggestions)
    },

    // ---

    scrollToActiveSuggestion() {
      const activeItem = this.$el.querySelector('.is-active')
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center' })
      }
    },

    onKeyDown() {
      if (this.suggestions.length === 0)
        return

      if (this.selectedSuggestionIndex === null) {
        this.selectedSuggestionIndex = this.suggestions.length - 1
        return
      }

      if (this.selectedSuggestionIndex === this.suggestions.length - 1) {
        this.selectedSuggestionIndex = 0
        return
      }

      this.selectedSuggestionIndex++

      this.scrollToActiveSuggestion()
    },
    onKeyUp() {
      if (this.suggestions.length === 0)
        return

      if (this.selectedSuggestionIndex === null) {
        this.selectedSuggestionIndex = 0
        return
      }

      if (this.selectedSuggestionIndex === 0) {
        this.selectedSuggestionIndex = this.suggestions.length - 1
        return
      }

      this.selectedSuggestionIndex--

      this.scrollToActiveSuggestion()
    },
    onKeyEnter() {
      if (this.suggestions.length === 0)
        return

      const suggestion = this.suggestions[this.selectedSuggestionIndex || 0]
      suggestion?.onEnter?.()
      this.suggestions = []
    }
  }
}
</script>

<template>
  <div id="command-line-group">
    <div id="command-line-wrapper">
      <input
        id="command-line"
        v-model="inputValue"
        @input="onInput"
        @keydown.down.prevent="onKeyDown"
        @keydown.up.prevent="onKeyUp"
        @keydown.enter.prevent="onKeyEnter"
      />
    </div>
    <div v-if="suggestions.length > 0" id="suggestions-popover">
      <ul id="suggestions-list">
        <li
          id="suggestions-item"
          v-for="(suggestion, index) in suggestions"
          :key="index"
          :class="{ 'is-active': index == selectedSuggestionIndex }"
        >
          {{ suggestion.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
#command-line-group {
  position: relative;

  width: 100%;
}

#command-line-wrapper {
  position: relative;
  z-index: 20;

  background-color: hsl(227, 17%, 16%);

  padding: 1.5rem;
  border-radius: 2rem;
  border-width: 1px;
  border-color: white;
  border-style: solid;
}

#command-line {
  border: none;
  background: none;
  outline: none;

  color: white;
}

#suggestions-popover {
  z-index: 10;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50%;
  padding: 1.5rem 1.5rem 3rem;

  background-color: hsl(227, 17%, 16%);
  border-radius: 2rem 2rem 0 0;

  overflow: hidden;
}

#suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;

  overflow-y: auto;
  max-height: 13rem;
}

#suggestions-item {
  padding: 0.5rem;
  cursor: pointer;

  color: white;
}

#suggestions-item.is-active {
  background-color: #f0f0f0;
}
</style>
