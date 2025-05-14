<template>
  <div>
    <div v-if="loading" class="text-center pa-5">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Loading User...</p>
    </div>
    <v-container v-if="user" class="py-10">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="4">
          <!-- Delete Confirmation Dialog -->
          <v-dialog v-model="showDeleteConfirmDialog" max-width="500px" persistent>
            <v-card>
              <v-card-title class="text-h5">Confirm Deletion</v-card-title>
              <v-card-text>
                Are you sure you want to delete the user "{{ itemToDeleteDetails.username }}"? This
                action cannot be undone.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDeleteConfirmDialog">Cancel</v-btn>
                <v-btn color="red darken-1" text @click="confirmDeleteUser">Delete</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-card class="elevation-10 rounded-xl pa-6 profile-card">
            <v-row align="center">
              <v-col cols="12" md="4" class="text-center">
                <v-avatar size="120" class="mx-auto mb-4">
                  <v-img :src="defaultAvatar" alt="User Avatar"></v-img>
                </v-avatar>
                <v-chip color="primary" class="mt-2" label>
                  {{ user.role }}
                </v-chip>
              </v-col>
              <v-col cols="12" md="8">
                <h2 class="font-weight-bold mb-1">
                  <div class="name-info" v-if="!isEditingName">
                    <span>Name: {{ user.username || 'Unknown User' }}</span>
                    <v-icon left @click="startEditUsername" class="ml-2" style="cursor: pointer"
                      >mdi-account-edit</v-icon
                    >
                  </div>
                  <div v-else>
                    <v-text-field
                      v-model="usernameToEdit"
                      label="Edit Name"
                      @keyup.enter="saveUsernameChanges"
                      outlined
                      dense
                      hide-details
                      class="mb-2"
                    ></v-text-field>
                    <div>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="saveUsernameChanges"
                        small
                        class="mr-2"
                      >
                        <v-icon left>mdi-check</v-icon>Save
                      </v-btn>
                      <v-btn text @click="cancelEditUsername" small>Cancel</v-btn>
                    </div>
                  </div>
                </h2>

                <v-divider class="my-4"></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title> Joined: {{ formatDate(Date.now()) }} </v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-divider class="my-4"></v-divider>
                <div class="actions">
                  <v-btn
                    color="red-darken-1"
                    class="mt-4"
                    outlined
                    @click="openDeleteConfirmDialog(user)"
                  >
                    <v-icon left>mdi-delete</v-icon>
                    Delete Profile
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div v-else>
      <p>No user data available.</p>
    </div>
  </div>
</template>

<script>
import { useCerealStore } from '@/stores/cerealStore'
import { mapActions, mapState } from 'pinia'

export default {
  data() {
    return {
      loading: false,
      defaultAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
      showDeleteConfirmDialog: false,
      itemToDeleteDetails: { id: null, username: '' },
      isEditingName: false,
      usernameToEdit: '', // Local state for the username being edited
    }
  },
  computed: {
    ...mapState(useCerealStore, ['user']),
  },
  methods: {
    ...mapActions(useCerealStore, ['updateUser', 'deleteUser']),
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString()
    },

    startEditUsername() {
      if (this.user) {
        this.usernameToEdit = this.user.username // Initialize with current username
        this.isEditingName = true
      }
    },

    async saveUsernameChanges() {
      if (!this.user || !this.user.id) {
        alert('User data is not available.')
        return
      }
      if (this.usernameToEdit.trim() === '') {
        alert('Username cannot be empty.')
        return
      }

      this.loading = true
      try {
        // Call the updateUser action with the locally edited username
        await this.updateUser({
          id: this.user.id,
          username: this.usernameToEdit.trim(),
          role: this.user.role,
          password: this.user.password,
        })
        this.isEditingName = false
        // Assuming the updateUser action in your store correctly updates the user state,
        // this.user.username will reactively update in the template.
        // You could add a success notification here.
      } catch (error) {
        console.error('Failed to update username:', error)
        alert('Failed to update username. Please try again.')
        // Optionally, you might want to keep isEditingName = true or revert usernameToEdit
      } finally {
        this.loading = false
      }
    },

    cancelEditUsername() {
      this.isEditingName = false
      // usernameToEdit will be reset the next time startEditUsername is called
    },

    openDeleteConfirmDialog(userToDelete) {
      if (userToDelete && userToDelete.id && userToDelete.username) {
        this.itemToDeleteDetails = { id: userToDelete.id, username: userToDelete.username }
        this.showDeleteConfirmDialog = true
      } else {
        console.error('Invalid user data provided for deletion:', userToDelete)
        alert('Could not initiate profile deletion. User data is missing.')
      }
    },

    closeDeleteConfirmDialog() {
      this.showDeleteConfirmDialog = false
      this.itemToDeleteDetails = { id: null, username: '' }
    },

    confirmDeleteUser() {
      if (!this.itemToDeleteDetails.id) {
        console.error('No user ID found for deletion.')
        alert('Error: No user selected for deletion.')
        this.closeDeleteConfirmDialog()
        return
      }
      this.loading = true
      this.deleteUser(this.itemToDeleteDetails.id)
        .then(() => {
          alert('Profile deleted successfully!')
          this.closeDeleteConfirmDialog()
          this.$router.push('/login')
        })
        .catch((error) => {
          console.error('Error deleting profile:', error)
          alert('Failed to delete profile. Please try again.')
          this.closeDeleteConfirmDialog()
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
.profile-card {
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  border: 1px solid #e3e8ee;
}

.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding: 0;
}

.actions {
  display: flex;
  justify-content: space-between; /* This will space out buttons if you add more */
  margin-top: 20px;
}

.name-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name-info .v-icon {
  cursor: pointer;
}

.name-info .v-icon:hover {
  color: #006dfc; /* Vuetify primary color */
  transition: color 0.3s;
}
</style>
