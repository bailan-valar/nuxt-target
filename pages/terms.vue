<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        服务条款
      </h1>
      <p class="text-sm text-gray-600">
        最后更新时间: {{ currentDate }}
      </p>
    </div>

    <!-- 内容卡片 -->
    <div class="bg-white rounded-lg shadow-sm p-8 space-y-8">
      <!-- 简介 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          引言
        </h2>
        <p class="text-gray-700 leading-relaxed">
          欢迎使用我们的服务。在使用本服务之前，请仔细阅读并理解本服务条款。使用我们的服务即表示您同意遵守这些条款。如果您不同意这些条款，请不要使用我们的服务。
        </p>
      </section>

      <!-- 服务描述 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          服务描述
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          本服务是一个目标管理和追踪平台，帮助用户创建、管理和实现个人目标。服务功能包括：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>创建和编辑目标</li>
          <li>目标分类和文件夹管理</li>
          <li>进度追踪和状态更新</li>
          <li>个人数据管理</li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
        </p>
      </section>

      <!-- 用户责任 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          用户责任
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          使用本服务时，您同意：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>提供真实、准确的注册信息</li>
          <li>维护账户安全性，保护密码安全</li>
          <li>对通过您的账户进行的所有活动负责</li>
          <li>不与他人共享账户和密码</li>
          <li>立即通知我们任何未经授权的访问</li>
          <li>遵守所有适用的法律法规</li>
        </ul>
      </section>

      <!-- 禁止行为 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          禁止行为
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          您不得：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>使用服务进行任何非法目的</li>
          <li>侵犯他人的知识产权或其他权利</li>
          <li>上传恶意软件、病毒或其他有害代码</li>
          <li>干扰或破坏服务的运行</li>
          <li>未经授权访问系统的任何部分</li>
          <li>对服务进行逆向工程或尝试提取源代码</li>
          <li>滥用技术支持或提交虚假报告</li>
        </ul>
      </section>

      <!-- 知识产权 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          知识产权
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          本服务及其原始内容、功能和设计均为我们或我们的许可方的专有财产，受版权、商标和其他知识产权法律保护。
        </p>
        <p class="text-gray-700 leading-relaxed mb-4">
          您对您在服务中创建的内容保留所有权。通过创建内容，您授予我们在全球范围内存储、显示和传输您内容的权利，以便提供服务。
        </p>
        <p class="text-gray-700 leading-relaxed">
          您不得删除或更改服务上的任何版权、商标或其他专有声明。
        </p>
      </section>

      <!-- 用户内容 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          用户内容
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          您对您在服务中发布的内容承担全部责任。我们不对用户内容进行编辑或控制，但保留删除或审查任何违反本条款内容的权利。
        </p>
        <p class="text-gray-700 leading-relaxed">
          通过提交内容，您声明并保证：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>您拥有该内容或有权使用和授权该内容</li>
          <li>内容不违反任何第三方的权利</li>
          <li>内容不违法、有害、诽谤或侵犯隐私</li>
        </ul>
      </section>

      <!-- 隐私保护 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          隐私保护
        </h2>
        <p class="text-gray-700 leading-relaxed">
          我们重视您的隐私。有关我们如何收集、使用和保护您个人信息的详细信息，请参阅我们的<a href="/privacy" class="text-blue-600 hover:text-blue-800 underline">隐私政策</a>。使用本服务即表示您同意我们按照隐私政策处理您的数据。
        </p>
      </section>

      <!-- 免责声明 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          免责声明
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          服务按"原样"和"可用"的基础提供，不提供任何明示或暗示的保证。我们不保证：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>服务将不间断、及时、安全或无错误</li>
          <li>从服务获得的结果将是准确或可靠的</li>
          <li>服务的错误将被纠正</li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          您通过服务下载或以其他方式获得的任何材料均由您自行决定并承担风险。对于因使用服务而导致的任何损害，我们不承担责任。
        </p>
      </section>

      <!-- 责任限制 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          责任限制
        </h2>
        <p class="text-gray-700 leading-relaxed">
          在法律允许的最大范围内，我们不对以下情况承担责任：直接、间接、附带、特殊、后果性或惩罚性损害，包括但不限于利润损失、数据丢失、商誉损失或其他无形损失，源于：使用或无法使用服务；未授权访问您的数据或传输；服务中的错误或遗漏。
        </p>
      </section>

      <!-- 服务终止 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          服务终止
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          我们可能因以下原因立即终止或暂停您的账户和服务访问权限：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>违反本服务条款</li>
          <li>从事欺诈或非法活动</li>
          <li>滥用或不当使用服务</li>
          <li>我们自行决定认为必要或适当的情况</li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          终止后，您访问服务的权利将立即停止。如果您想永久删除账户，请联系我们。
        </p>
      </section>

      <!-- 条款变更 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          条款变更
        </h2>
        <p class="text-gray-700 leading-relaxed">
          我们保留随时修改这些条款的权利。修改后的条款将在本页面上发布，并更新"最后更新时间"。继续使用服务即表示您接受修改后的条款。对于重大变更，我们将通过电子邮件或其他适当方式通知您。
        </p>
      </section>

      <!-- 适用法律 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          适用法律
        </h2>
        <p class="text-gray-700 leading-relaxed">
          本条款受中华人民共和国法律管辖并依其解释。与本条款相关的任何争议应通过友好协商解决。如果协商不成，任何一方均可向我们所在地有管辖权的人民法院提起诉讼。
        </p>
      </section>

      <!-- 其他条款 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          其他条款
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          这些条款构成您与我们之间关于服务使用的完整协议。如果我们未能执行这些条款的任何权利或规定，不构成对该权利的放弃。
        </p>
        <p class="text-gray-700 leading-relaxed">
          如果这些条款的任何规定被认定为无效或不可执行，其余条款仍然有效。
        </p>
      </section>

      <!-- 联系我们 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          联系我们
        </h2>
        <p class="text-gray-700 leading-relaxed">
          如果您对本服务条款有任何疑问或意见，请通过以下方式与我们联系：
        </p>
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-gray-700">
            <strong>电子邮箱:</strong> support@example.com
          </p>
          <p class="text-gray-700 mt-2">
            我们将在收到您的询问后尽快回复，通常在 5 个工作日内。
          </p>
        </div>
      </section>
    </div>

    <!-- 返回首页按钮 -->
    <div class="mt-8 text-center">
      <NuxtLink
        to="/"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面元信息
useHead({
  title: '服务条款',
  meta: [
    {
      name: 'description',
      content: '了解使用我们服务的条款和条件'
    }
  ]
})

// 当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>
