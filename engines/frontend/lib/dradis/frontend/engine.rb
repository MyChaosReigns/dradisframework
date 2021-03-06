module Dradis
  module Frontend
    class Engine < ::Rails::Engine
      isolate_namespace Dradis::Frontend

      initializer 'frontend.append_migrations' do |app|
        unless app.root.to_s == root.to_s
          config.paths["db/migrate"].expanded.each do |path|
            app.config.paths["db/migrate"].push(path)
          end
        end
      end

      initializer 'frontend.asset_precompile_paths' do |app|
        app.config.assets.precompile += ["dradis/frontend/manifests/*"]
      end

      initializer 'frontend.inflections' do |app|
        ActiveSupport::Inflector.inflections do |inflect|
          inflect.uncountable %w( evidence )
        end
      end

      # Install the Warden middleware in the application's stack. We use our own
      # shared password strategy.
      initializer 'frontend.warden' do |app|
        Rails.configuration.middleware.use Warden::Manager do |manager|
          manager.default_strategies :shared_password
          manager.failure_app = ->(env){ SessionsController.action(:new).call(env) }
        end

        Warden::Strategies.add(:shared_password, Dradis::Frontend::WardenStrategy)
      end
    end
  end
end