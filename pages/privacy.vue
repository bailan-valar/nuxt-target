<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        隐私政策
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
          欢迎使用我们的服务。我们非常重视您的隐私权。本隐私政策旨在帮助您了解我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本隐私政策的条款。
        </p>
      </section>

      <!-- 信息收集 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          我们收集的信息
        </h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">
              账户信息
            </h3>
            <p class="text-gray-700 leading-relaxed">
              当您创建账户时，我们会收集您的邮箱地址和密码。我们使用 bcrypt 算法对密码进行加密存储，确保您的账户安全。
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">
              使用数据
            </h3>
            <p class="text-gray-700 leading-relaxed">
              我们可能会收集关于您如何使用我们服务的信息，包括访问时间、使用的功能以及与服务的交互记录。这些数据帮助我们改进服务质量。
            </p>
          </div>

          <div>
            <h3 class="text-lg font-medium text-gray-800 mb-2">
              Cookie 和类似技术
            </h3>
            <p class="text-gray-700 leading-relaxed">
              我们使用 Cookie 和类似技术来记住您的登录状态、提供个性化体验并分析服务使用情况。您可以通过浏览器设置管理 Cookie 偏好。
            </p>
          </div>
        </div>
      </section>

      <!-- 信息使用 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          我们如何使用您的信息
        </h2>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的请求和交易</li>
          <li>向您发送重要通知和更新</li>
          <li>分析服务使用情况以优化用户体验</li>
          <li>检测、预防和解决技术问题及安全问题</li>
          <li>遵守法律义务和保护我们的权利</li>
        </ul>
      </section>

      <!-- 信息共享 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          信息共享
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          我们承诺不会出售、出租或以其他方式向第三方披露您的个人信息，除非符合以下情况：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>获得您的明确同意</li>
          <li>为了提供您请求的服务</li>
          <li>遵守法律要求或法院命令</li>
          <li>保护我们的权利、财产或安全</li>
          <li>与可信的服务提供商合作（在保密协议下）</li>
        </ul>
      </section>

      <!-- 数据安全 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          数据安全
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          我们采取多种安全措施来保护您的个人信息：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>使用 HTTPS 加密传输</li>
          <li>密码使用 bcrypt 加密存储</li>
          <li>定期更新安全协议</li>
          <li>限制对个人信息的访问权限</li>
          <li>定期进行安全审计</li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          尽管我们努力保护您的信息，但没有任何互联网传输或电子存储方法是 100% 安全的。因此，我们无法保证绝对的安全性。
        </p>
      </section>

      <!-- 您的权利 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          您的隐私权利
        </h2>
        <p class="text-gray-700 leading-relaxed mb-4">
          您对自己的个人信息享有以下权利：
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>访问权:</strong> 您可以请求查看我们持有的您的个人信息</li>
          <li><strong>更正权:</strong> 您可以要求更新或更正不准确的信息</li>
          <li><strong>删除权:</strong> 您可以要求删除您的账户和相关个人信息</li>
          <li><strong>反对权:</strong> 您可以反对某些信息处理活动</li>
          <li><strong>数据可携权:</strong> 您可以请求以结构化格式接收您的数据</li>
        </ul>
        <p class="text-gray-700 leading-relaxed mt-4">
          如需行使这些权利，请通过下方提供的联系方式与我们联系。
        </p>
      </section>

      <!-- Cookie 管理 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Cookie 管理
        </h2>
        <p class="text-gray-700 leading-relaxed">
          您可以通过浏览器设置管理或删除 Cookie。请注意，禁用 Cookie 可能会影响某些功能的正常使用。我们建议您查看浏览器的帮助文档以了解如何管理 Cookie。
        </p>
      </section>

      <!-- 第三方链接 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          第三方链接
        </h2>
        <p class="text-gray-700 leading-relaxed">
          我们的服务可能包含指向第三方网站的链接。我们对这些网站的内容或隐私惯例不承担任何责任。我们鼓励您在离开我们的服务时查看这些网站的隐私政策。
        </p>
      </section>

      <!-- 儿童隐私 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          儿童隐私
        </h2>
        <p class="text-gray-700 leading-relaxed">
          我们的服务面向所有年龄段的用户。如果我们发现未经父母同意收集了未满 13 岁儿童的个人信息，我们将采取措施删除这些信息。
        </p>
      </section>

      <!-- 政策变更 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          隐私政策的变更
        </h2>
        <p class="text-gray-700 leading-relaxed">
          我们可能会不时更新本隐私政策。更新后，我们将在此页面上发布新版本，并更新"最后更新时间"。重大变更时，我们会通过电子邮件或其他适当方式通知您。我们鼓励您定期查看本政策。
        </p>
      </section>

      <!-- 联系我们 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          联系我们
        </h2>
        <p class="text-gray-700 leading-relaxed">
          如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式与我们联系：
        </p>
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-gray-700">
            <strong>电子邮箱:</strong> privacy@example.com
          </p>
          <p class="text-gray-700 mt-2">
            我们将在收到您的请求后尽快回复，通常在 30 天内。
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
  title: '隐私政策',
  meta: [
    {
      name: 'description',
      content: '了解我们如何收集、使用和保护您的个人信息'
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
