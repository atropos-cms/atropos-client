<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px"
      class="el-form--label-narrow">

      <el-form-item :label="$t('modules.media.files.owner')">
        <user :id="file.owner_id"/>
      </el-form-item>

      <el-form-item :label="$t('modules.media.files.date')">
        {{ file.created_at | moment("LL") }}
      </el-form-item>

      <el-form-item :label="$t('modules.media.files.filename')">
        {{ file.original_filename }}
      </el-form-item>

      <el-form-item :label="$t('modules.media.files.file-size')">
        {{ file.size | filesize }}
      </el-form-item>

      <template v-if="file.exif">

        <el-form-item
          v-if="file.exif.width && file.exif.height"
          :label="$t('modules.media.files.dimensions')">
          {{ $t('modules.media.files.dimensions-pixels', {width: file.exif.width, height: file.exif.height}) }}
        </el-form-item>

        <el-form-item
          v-if="file.exif.CreateDate"
          :label="$t('modules.media.files.creation-date')">
          {{ file.exif.CreateDate | moment("LL") }}
        </el-form-item>

      </template>

    </el-form>
  </div>
</template>

<script type="text/babel">
import User from '~/components/user'

export default {
  components: {
    User
  },

  props: {
    file: {
      type: Object,
      required: true
    }
  },

  computed: {
  }
}
</script>
